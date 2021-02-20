#include <Arduino.h>

//Definitions
#define BAUD_RATE 115200

//Variables
const float FW_VERSION = 1.0;
unsigned long healthPreviousMillis = 0;
unsigned long sensorPreviousMillis = 0;
unsigned long healthInterval = 0;
unsigned long sensorInterval = 0;

float lat = 0, lon = 0, accuracy = 0;
int year = 0, month = 0, day = 0;
int hour = 0, minute = 0, sec = 0;
bool check_update;

String DEVICE_ID;
String CAR_ID;

//Personal Library
#include <CarMonitor.CanBus.h>
#include <CarMonior.OLED.h>
#include <CarMonitor.File.h>
#include <CarMonitor.GSM.h>
#include <CarMonitor.HTTP.h>
#include <CarMonitor.Helper.h>
#include <CarMonitor.MQTT.h>

void setup()
{
    log_d("begin setup");
    Serial.begin(BAUD_RATE);
    log_d("setup serial baud rate %i", BAUD_RATE);

    log_d("begin setup CanBus");
    setupCanBus();
    log_d("begin setup CanBus - OK");

    log_d("setup OLED Screen");
    if (!setupOled()) ESP.restart();
    log_d("setup OLED Screen Completed");

    printOledTextSingleLine("Iniciando Sistema");

    log_d("configuring file system");
    if (!setupFile()) ESP.restart();
    log_d("configuration file system completed");

    log_d("getting Configuration File");
    getConfig();
    log_d("getting Configuration File - OK");

    log_d("configuring GSM");
    setup_gsm();
    log_d("configuration GSM - OK");

    log_d("update Configuration");
    updateConfiguration(false);
    log_d("update Configuration - OK");

    log_d("checking for updates");
    check_update = config["check_update"].as<bool>();
    if(check_update) checkUpdate("");
    log_d("checking for updates - OK");

    log_d("setup MQTT");
    setupMQTT();
    log_d("setup MQTT - OK");

    log_d("setting variables");
    healthInterval = config["health_interval"].as<long>();
    sensorInterval = config["sensor_interval"].as<long>();
    log_d("setting variables - OK");

    log_w("begin setup complete");
    delay(100);
}
void loop()
{
    connectMQTT();

    unsigned long currentMillis = millis();
    
    if (currentMillis - healthPreviousMillis >= healthInterval)
    {
        sendHealthStatus();
        healthPreviousMillis = currentMillis;
    }
    
    if (currentMillis - sensorPreviousMillis >= sensorInterval){
        sendSensorData();
        sensorPreviousMillis = currentMillis;
    }
    
    printOledTextSingleLine("TCC - Senai");
}