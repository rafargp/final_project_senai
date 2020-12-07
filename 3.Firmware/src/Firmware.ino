#include <Helper.h>

const float FW_VERSION = 0.1;
int DEVICE_ID = -1;

void setup()
{
  Serial.begin(115200);
  delay(5);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println("FW Version: " + String(FW_VERSION));

}

void loop()
{
  // turn the LED on (HIGH is the voltage level)
  digitalWrite(LED_BUILTIN, HIGH);
  // wait for a second
  delay(1000);
  // turn the LED off by making the voltage LOW
  digitalWrite(LED_BUILTIN, LOW);
   // wait for a second
  delay(1000);
}