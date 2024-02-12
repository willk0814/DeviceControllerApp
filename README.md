# DeviceControllerApp

## Description
This is an application that I developed in collaboration with 4 other engineers.  The application is built almost entirely in `JavaScript` using `React Native`.  The application is an interface for researchers to use to control an arduino powered research device, called a SMURF.  Using our application a researcher can calibrate the research device, run multiple different tests, and harvest formatted data that is ready to be exported.

I initally came on to this project through a work study program at my University, before being offered a part-time role.  I was tasked with developing a mobile application to replace their current system of interaction which involved a hard wired computer and bash commands.  This presented a lot of challenges; carrying a computer through a corn field can be very difficult, the researcher is limited to one research device, and the data is returned as a CSV file that needs to be properly formatted before being stored.

Our application solved these problems by offering an interface for the researcher to connect to multiple research devices via bluetooth, allowing them to run all necessary commands, and preprocessing data so that is ready for exporting per the labs standards.

## Demo
If you click on the below image you will be taken to a YouTube video that demonstrates the user interface of the application.

[![Device Controller Demo](https://img.youtube.com/vi/vc_H3_WQKBI/0.jpg)](https://www.youtube.com/watch?v=vc_H3_WQKBI)


## Download & Run Instructions
If you happen to have a SMURF and want to run this project for yourself you can use the following instructions:
### Preparing the Arduino Powered Robot
  1. Download arduino IDE
  2. Add necessary libraries to Arduino IDE (you will be prompted)
  3. Connect Device and select correct port (whichever port disappears when the device is disconnected)
  4. Compile and Upload

### Running and deploying theh React Native application
  1. Once you have the project download, navigate to the project directory with the following
```bash
cd path/to/downloaded/project
```
  2. Within the project directory install the necessary Node packages with the following
```bash
npm install
``` 
or if you are using yarn
```bash
yarn install
```
  3. Since we are going to be creating an iOS build of this application we need to setup and install CocoaPods. To do this we are going to navigate to the iOS directory and run the following commands

```bash
cd ios
```
```bash
pod setup
```
```bash
pod install
```
  4. In order to run the application on an iPad we need to open an instance of this project in Xcode; run the following command to do so
```bash
xed ios
```
  5. Since this application makes use of Native features (bluetooth) the only way to truly test it is to do so on a BLE enabled iPad.  So from this point onn you will need an iPad; go ahead and connect that iPad to your Mac and within Xcode select it as your build destination.
  6. Build the application
  7. If this is the first application that you have tested on your iPad you will need to authorize your developer account from within settings on the iPad.
