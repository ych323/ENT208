## Project Title

**Environmental Monitoring and Alarm System Based on UIFlow 2.0**

## Project Overview

This project was developed using **UIFlow 2.0** on the **M5Stack device**.
Its main purpose is to monitor **temperature**, **humidity**, and **air pressure** in real time, display the data on the screen, and trigger an alarm when any value exceeds the preset threshold.

The project combines **sensor data acquisition**, **logical judgment**, **screen output**, and **alarm feedback**, allowing users to observe environmental changes more intuitively and respond in time when abnormal conditions occur.

<img width="2557" height="1336" alt="image" src="https://github.com/user-attachments/assets/b8fda66a-b0f6-4145-a324-3b96e204d647" />

## Main Functions

The system includes the following functions:

* Real-time detection of **temperature**
* Real-time detection of **humidity**
* Real-time detection of **air pressure**
* Display of the measured values on the device screen
* Threshold comparison for each parameter
* Alarm triggered when temperature, humidity, or pressure exceeds the preset limit

## Content in UIFlow 2.0

In UIFlow 2.0, the project mainly consists of the following parts:

### 1. Sensor Data Reading

The program reads environmental data from the connected sensor module, including:

* Temperature
* Humidity
* Pressure

These values are continuously updated in the main loop.

### 2. Variable Settings

Several variables are defined in UIFlow to store both the real-time sensor values and the threshold values, such as:

* `temp`
* `humi`
* `press`
* `temp_max`
* `humi_max`
* `press_max`

The real-time values are used for display and comparison, while the maximum values are used as alarm standards.

### 3. Logical Judgment

The core judgment logic in the program is:

```
(temp > temp_max) OR (humi > humi_max) OR (press > press_max)
```

This means that if **any one** of the three values exceeds its threshold, the system will enter the alarm state.

### 4. Screen Display

The current temperature, humidity, and pressure values are displayed on the screen in real time.
This allows users to directly observe environmental conditions without connecting to other software.

Displayed information includes:

* Current temperature
* Current humidity
* Current pressure
* Alarm status message if needed

### 5. Alarm Function

When the monitored value exceeds the threshold, the device activates the alarm output.
Depending on the hardware setup, this may include:

* buzzer alarm
* RGB light reminder
* on-screen warning message

This makes the system more interactive and practical.

### 6. Loop Execution

The whole program runs in a loop, so the system can continuously:

1. read sensor data
2. update displayed values
3. compare with thresholds
4. trigger or stop the alarm

This ensures real-time monitoring.

## Modules Used

The main modules or functional blocks used in UIFlow 2.0 include:

* Start / setup block
* Variable definition blocks
* Sensor reading blocks
* Logic comparison blocks
* OR condition block
* If statement block
* Screen display blocks
* Alarm output blocks
* Loop / repeat blocks

## Project Logic

The workflow of the project can be summarized as:

1. Initialize the device and screen
2. Read temperature, humidity, and pressure data
3. Display all values on the screen
4. Compare each value with its threshold
5. If any value exceeds the limit, trigger the alarm
6. If all values are normal, keep the system in monitoring state
7. Repeat continuously

## Learning Outcomes

Through this project, we learned how to:

* use UIFlow 2.0 to build an IoT application
* connect sensors and read environmental data
* use variables and logical conditions in block programming
* display real-time information on the screen
* design a simple alarm system
* combine hardware and software for practical monitoring tasks

## Possible Improvements

In the future, the project could be further improved by adding:

* adjustable thresholds through buttons
* data logging function
* wireless transmission of sensor data
* cloud storage and remote monitoring
* more detailed warning interface

## Conclusion

This project demonstrates a simple but practical environmental monitoring system built in UIFlow 2.0.
By combining sensor input, logical analysis, visual display, and alarm feedback, the system can help users monitor environmental conditions more effectively and understand how embedded programming works in real applications.
