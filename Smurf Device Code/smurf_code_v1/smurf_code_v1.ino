// This code is uploaded to the Arduino Nano inside the SMURF
// Calibration should be done beforehand to determine preload and loadcell calibration factor

//Includes required to use Roboclaw library
#include <SoftwareSerial.h>
#include "RoboClaw.h"
#include "HX711.h"
#include <Arduino.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "Adafruit_ATParser.h"

// Set software serial and init instances of roboclaw/loadcell
SoftwareSerial serial(10,11);
RoboClaw roboclaw(&serial,10000);
HX711 scale;

//ripped this relavent part of Adafruit_BLE.h
#define BUFSIZE                        128   // Size of the read buffer for incoming data
#define VERBOSE_MODE                   true  // If set to 'true' enables debug output
#define BLUEFRUIT_SWUART_RXD_PIN       8    // Required for software serial!
#define BLUEFRUIT_SWUART_TXD_PIN       9   // Required for software serial!
#define BLUEFRUIT_UART_CTS_PIN         7   // Required for software serial!
#define BLUEFRUIT_UART_MODE_PIN        -1
#define BLUEFRUIT_UART_RTS_PIN         -1

//setting up the software serial connection to Bluefruit Friend and initializing object
SoftwareSerial bluefruitSS = SoftwareSerial(BLUEFRUIT_SWUART_TXD_PIN, BLUEFRUIT_SWUART_RXD_PIN);
Adafruit_BluefruitLE_UART ble(bluefruitSS, BLUEFRUIT_UART_MODE_PIN,BLUEFRUIT_UART_CTS_PIN, BLUEFRUIT_UART_RTS_PIN);

// Set address and PID constants for roboclaw
// You can download the basic motion interface if you want to play with these values
// https://www.basicmicro.com/downloads
#define address 0x80
#define Kp 6.3865
#define Ki 0.99935
#define Kd 0.0
#define Kp_pos 10.0
#define Ki_pos 0.0
#define Kd_pos 0.0
#define qpps 2630  // 2790 for 5:1 ratio motor
#define min_volts 9.0  // assume 3S LiPo battery
#define max_volts 13.0

// Set pins and calibration factor for loadcell
#define DOUT  3
#define CLK  2
float calibration_factor = -235150; // -235150.00, kg calibrated with 2.722g and verified with 1.360kg
                                    // use load cell calibration code to calibrate, then upload this code to the smurfs arduino nano

// Variables that might adjust depending on motor/geaar ratio selection
// BILDA 5202 Series Yellow Jacket 117RPM @12VDC planetary gear motor (high torque version)
int enc_limit = 28000;  // maximum encoder counts before pusher leg bottoms out 30000, added some buffer
float preload = 0.00; //1.26 for small;  // calibrate loadcell, then use '4' command to display loadcell value when smurf is upright under load from only its own weight (kg) - positive number
float distance_per_count = 0.0056/1000;  //distance pusher moves per encoder count (mm/1000=m) -> 0.0547/1000 for 5rpm
float lever_arm = 0.150;  // distance between center of stalk and pusher foot (m)

// Initialization variables
String input;
String currentCommand;

int pos = 0;
long init_height = 0;
uint32_t enc1;
uint32_t enc2;
float loads [9];  // loads that will be saved for each bending trial
float bend_angle = 0;  // bend angle in degrees
float pi = 3.1415;
int push_counts = 0;

// For bt module 
int32_t CMDCharId;
int32_t DATACharId;
int32_t DATAChar2Id;                                       //Can remove these lines after we confirm they are useless


// Display loadcell in kgs and adjust readings based on calibration factor
void display_loadcell(){
  scale.set_scale(calibration_factor); //Adjust to this calibration factor
  //Serial.print("Load reading: ");
  //Serial.print(scale.get_units(), 1);  // the 1 rounds to one decimal place
  //Serial.print(" kgs"); //Change this to kg and re-adjust the calibration factor if you follow SI units like a sane person
  //Serial.println();
}//display_loadcell()


// Home SMURF and reset encoder values to zero
void home_encoder(){
  int enc_last = 0;
  int enc_now = 1;
  while (enc_last != enc_now){
    enc_last = enc_now;
    roboclaw.BackwardM1(0x80,25);  // moves foot up
    delay(100);
    roboclaw.ReadEncoders(address,enc1,enc2);  // can use encoders for error detection
    enc_now = enc1;
  }//while (enc_last != enc_now)
  roboclaw.ResetEncoders(address);
  roboclaw.BackwardM1(0x80,0);  // stops foot
}//home_encoder()


// Get serial input from python user interface
void get_input(){
  ble.flush();
//  while (Serial.available()) {
//    if (Serial.available() >0) {
//      ble.println(F("AT+GATTCHAR=3"));             // gotta read from the bt module
//      int len = ble.readraw();
//      char c = Serial.read();  //gets one byte from serial buffer
//      input += c; //makes the string readString
//      Serial.println("get_input()");
      uint16_t bufSize = 20;
      uint16_t timeout = 1000;
      char inputBuffer[bufSize];
      ble.atcommandStrReply("AT+GATTCHAR=3",inputBuffer,bufSize,timeout);
//      ble.println("AT+GATTCHAR=3");
      delay(2000);
      Serial.println("sent");
      input = inputBuffer;

      Serial.print("Unparsed Input: ");
      Serial.println(input);
      
      // establish indices of first and second appearance of '/n'
      int codeIndex = input.indexOf("3");

      Serial.print("index of code: ");
      Serial.println(codeIndex);

      char parsedInput_1 = input.charAt(codeIndex+2);
      char parsedInput_2 = input.charAt(codeIndex+3);
      String parsedInput;
      parsedInput += parsedInput_1;
      parsedInput += parsedInput_2;
      
      Serial.print("Parsed Input: ");
      Serial.println(parsedInput);

      int scaledInput = parsedInput.toInt() - 48;

      Serial.print("Scaled Input: ");
      Serial.println(scaledInput);

      String finalInput = String(scaledInput);

      Serial.print("Final Input: ");
      Serial.println(finalInput);

      if (finalInput != currentCommand) {
        input = finalInput;
        currentCommand = finalInput;
        ble.println(F ("AT+GATTCHAR=3,5"));  
        ble.flush();
      }
      

      
//    }//if (Serial.available() >0)
//  }//while (Serial.available())
}//get_input()

// Lower pushing foot until loadcell reads zero, the weight of the device will give a negative reading
// so when the load cell reads zero these effects are balanced
void get_init_height(){
  while (scale.get_units()-preload < 0){
    //Serial.println(scale.get_units()-preload);
    roboclaw.SpeedAccelM1(address,300,10000);  //roboclaw.ForwardM1(0x80,10); //was 25
    roboclaw.ReadEncoders(address,enc1,enc2);
    if (enc1 > enc_limit){
      //Serial.println("ERR: smurf could not find the ground, please place it lower on the stalk");
      //Serial.println(enc1); // for debug
      break;
    }//if (enc1 > enc_limit)
  }//while (scale.get_units()-preload < 0)
  roboclaw.ForwardM1(0x80,0);
  delay(500);
  roboclaw.ReadEncoders(address,enc1,enc2);
  init_height = enc1;
  Serial.println(init_height);                   
}//get_init_height()

void move_to(int pos){
  roboclaw.SpeedAccelDeccelPositionM1(address, 150000, 2000, 150000, pos, 0); //(address, 50000, 1000, 50000, pos, 0); for 5:1 ratio gears // SpeedAccelDeccelPositionM1(address, accel, speed, deccel, position, flag);
  delay(1000);
}//move_to(int pos


void small_flextest(){
  move_to(init_height);
  float bend_angles[] = {2.0, 2.5, 3.0, 3.5, 4.0}; // this should match the SMURF code, note i below this line is len(bend_angles)-1
  ble.print(F("AT+GATTCHAR="));            //writes to the DATA BT Service 
  ble.print( DATACharId );
  ble.print( ",");
  Serial.println("starting smallFlexTest");
  for (int i = 0; i < 4; i++){
    get_bend_counts(bend_angles[i]);
    move_to(init_height + push_counts);
    delay(100);
    ble.print("3.14"); //testing with pi
    //    ble.print(scale.get_units()-preload);  // init_height drops leg until preload value is measured, this offsets the weight of smurf. We need to subtract this load to get the amount of force pushing against the plant.
    ble.print(",");
  }//for (int i = 0; i < 4; i++)
  get_bend_counts(bend_angles[4]);
  move_to(init_height + push_counts);
  delay(100);
  ble.println(scale.get_units()-preload);  //subtract smurf weight here too
//   ble.println();
  Serial.println("finshing smallFlexTest");
  ble.flush();
}//small_flextest()


void large_flextest(){
  move_to(init_height);
  float bend_angles[] = {2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0}; // this should match the SMURF code, note i below this line is len(bend_angles)-1
  ble.print(F("AT+GATTCHAR="));            //writes to the DATA BT characteristic
  ble.print( DATACharId );
  ble.print( ",");
  for (int i = 0; i < 4; i++){
    get_bend_counts(bend_angles[i]);
    move_to(init_height + push_counts);
    delay(100);
    ble.print(scale.get_units()-preload);  // init_height drops leg until preload value is measured, this offsets the weight of smurf. We need to subtract this load to get the amount of force pushing against the plant.
    ble.print(",");
  }//for (int i = 0; i < 4; i++)
  ble.println();
  ble.print(F("AT+GATTCHAR="));            //writes to the DATA BT characteristic
  ble.print( DATAChar2Id );
  ble.print( ",");
  for (int i = 4; i < 8; i++){
    get_bend_counts(bend_angles[i]);
    move_to(init_height + push_counts);
    delay(100);
    ble.print(scale.get_units()-preload);  // init_height drops leg until preload value is measured, this offsets the weight of smurf. We need to subtract this load to get the amount of force pushing against the plant.
    ble.print(",");
  }//for (int i = 4; i < 8; i++)
  get_bend_counts(bend_angles[8]);
  move_to(init_height + push_counts);
  delay(100);
  ble.println(scale.get_units()-preload);  //subtract smurf weight here too
  ble.flush();
}//large_flextest()


void get_bend_counts(float bend_angle){
  float push_length = lever_arm * tan(pi*bend_angle/180);
  push_counts = round(push_length/distance_per_count);
  //Serial.print(push_counts);
}//get_bend_counts(float bend_angle


// This is the first function arduino runs on reset/power up
void setup() {
  int success = 0;  
  //Open Serial and roboclaw at 38400bps
  Serial.begin(115200);
  roboclaw.begin(38400);

  scale.begin(DOUT, CLK);
  display_loadcell();
  delay(10);

  //Set PID Coefficients
  roboclaw.SetM1VelocityPID(address,Kp,Ki,Kd,qpps);
  roboclaw.SetM1PositionPID(address, 20.0, 0.0, 0.0, 0,0,0,30000); //SetM1PositionPID(uint8_t address,float kp_fp,float ki_fp,float kd_fp,uint32_t kiMax,uint32_t deadzone,uint32_t min,uint32_t max)
  //Setup for the Bluetooth module
  ble.begin();
  ble.factoryReset();      
  Serial.println(F("Setting device name to 'Bluefruit SMURF_1': "));
  ble.println(F("AT+GAPDEVNAME=Bluefruit SMURF_1"));
  Serial.println( F("Adding Service 0x1234 with 3 chars 0x2345 & 0x6789 & 0xABCD") );
  ble.println( F("AT+GATTADDSERVICE=uuid=0x1234") );
  ble.reset();
  ble.println( F("AT+GATTADDCHAR=UUID=0x2345,PROPERTIES=0x02,MIN_LEN=1,MAX_LEN=20,DATATYPE=string,DESCRIPTION=Measurements,VALUE=abc"));
  DATACharId = 1;
  Serial.print("data characteristic has ID:");
  Serial.println(DATACharId);
  ble.reset();
  ble.println( F("AT+GATTADDCHAR=UUID=0xABCD,PROPERTIES=0x02,MIN_LEN=1,MAX_LEN=20,DATATYPE=string,DESCRIPTION=Measurements2,VALUE=abc"));
  DATAChar2Id = 2;
  Serial.print("data characteristic has ID:");
  Serial.println(DATAChar2Id);
  ble.reset();
  ble.println( F("AT+GATTADDCHAR=UUID=0x6789,PROPERTIES=0x08,MIN_LEN=4,MAX_LEN=4,DATATYPE=INTEGER,DESCRIPTION=CommandValue,VALUE=3"));
  CMDCharId = 3;
  Serial.print("Command characteristic has ID:");
  Serial.println(CMDCharId);
  ble.reset();
  ble.println( F("AT+GAPSETADVDATA=02-01-06-05-02-0d-18-0a-18") );
  /* Reset the device for the new service setting changes to take effect */
  Serial.println(F("Performing a SW reset (service changes require a reset): "));
  ble.reset();
}//void setup()

// Main loop
void loop() {
//  Serial.println("loop");
  get_input();
  if (input.length() >0) {
      delay(2000);
      Serial.print("input:");
      Serial.println(input); //see what was received for debug
      if (input == "0") {  // Calibrate encoder home and tare load cell
        Serial.println("Calibrate signal recieved");                       
        home_encoder();
        display_loadcell();
        scale.tare(); //Reset the scale to 0
      }
      else if (input ==  "1") {  // Find initial height
        get_init_height();        
      }
      else if (input ==  "2") {  // Move to init height position
        move_to(init_height);
      }
      else if (input ==  "3") {  // Move to home position
        move_to(0);
        Serial.println("This is a test");
      }
      else if (input == "4") {  // display current loadcell reading
        Serial.println("dispLoadcell signal recieved");
        display_loadcell();
        Serial.println(scale.get_units());
      }
      else if (input == "8") {  // start flextest small deflection
        Serial.println("smallFlexTest signal recieved");     
        small_flextest();  // get and send loads over serial to python script for anaylysis
      }

      else if (input == "9") {  // start flextest large deflection
        large_flextest();  // get and send loads over serial to python script for anaylysis
      }
        
      input = "";
      
  }//if (input.length() >0)
}//loop()
