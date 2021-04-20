#include <CAN.h>

#define TIMEOUT 3000 //Seconds

const bool useStandardAddressing = true;

/* 
Caso a Biblioteca Atualize
#define DEFAULT_CAN_RX_PIN GPIO_NUM_15
#define DEFAULT_CAN_TX_PIN GPIO_NUM_18
*/

String getSupportedPIDs()
{
  log_d("getting supprted PIDs");
  String PIDs = "";
  for (int pid = 0x00; pid < 0xe0; pid += 0x20)
  {
    if (useStandardAddressing) CAN.beginPacket(0x7df, 8);
    else CAN.beginExtendedPacket(0x18db33f1, 8);

    CAN.write(0x02); CAN.write(0x01); CAN.write(pid); CAN.endPacket();
    
    unsigned long currentMillis = millis();
    while (CAN.parsePacket() == 0 || CAN.read() < 6 || CAN.read() != 0x41 || CAN.read() != pid){
      if(millis() - currentMillis > TIMEOUT) {
        log_d("getting supprted PIDs timeout");
        break;
      }  
    }

    unsigned long pidsSupported = 0;

    for (int i = 0; i < 4; i++)
    {
      pidsSupported <<= 8;
      pidsSupported |= CAN.read();
    }

    for (unsigned int i = 31; i > 0; i--)
    {
      if (pidsSupported & (1UL << i))
      {
        int pidSupported = pid + (32 - i);

        PIDs += "0x";
        if (pidSupported < 16) PIDs += "0";
        PIDs += String(pidSupported) + ",";
      }
    }

    if ((pidsSupported & 0x00000001) == 0x00000000) break;
  }
  log_d("Supported PIDs: %s",PIDs.c_str());
  return PIDs;
}
String getVINCar()
{
  log_d("getting car information");
  String VIN_Car = "";

  if (useStandardAddressing) CAN.beginPacket(0x7df, 8);
  else CAN.beginExtendedPacket(0x18db33f1, 8);

  CAN.write(0x02);CAN.write(0x09);CAN.write(0x02); CAN.endPacket();
  unsigned long currentMillis = millis();
  while (CAN.parsePacket() == 0 || CAN.read() != 0x10 || CAN.read() != 0x14 || CAN.read() != 0x49 || CAN.read() != 0x02 || CAN.read() != 0x01){
    if(millis() - currentMillis > TIMEOUT) {
      log_d("getting car information timeout");
      return "";
    }
  }
  
  while (CAN.available()) VIN_Car += (char) CAN.read();

  for (int i = 0; i < 2; i++)
  {
    if (useStandardAddressing) CAN.beginPacket(0x7e0, 8);
    else CAN.beginExtendedPacket(0x18db33f1, 8);
    
    CAN.write(0x30); CAN.endPacket();

    while (CAN.parsePacket() == 0 || CAN.read() != (0x21 + i));

    while (CAN.available()) VIN_Car += (char)CAN.read();
  }
  log_d("Chassi: %s",VIN_Car.c_str());
  return VIN_Car;
}
void setupCanBus()
{
  log_d("start Setup CanBus");

  log_d("starting the CAN bus at 500 kbps");
   
  if (!CAN.begin(500E3))
    ESP.restart();

  if (useStandardAddressing) CAN.filter(0x7e8);
  else CAN.filterExtended(0x18daf110);

  log_d("start Setup CanBus - OK");
}
float getRPM()
{
  if (useStandardAddressing) CAN.beginPacket(0x7df, 8);
  else CAN.beginExtendedPacket(0x18db33f1, 8);
  
  CAN.write(0x02); CAN.write(0x01); CAN.write(0x0c); CAN.endPacket();
  
  unsigned long currentMillis = millis();
  while (CAN.parsePacket() == 0 || CAN.read() < 3 || CAN.read() != 0x41 || CAN.read() != 0x0c) {
    if(millis() - currentMillis > TIMEOUT) {
      log_d("Read RPM timeout");
      return 0;
    }
  }

  return (float) ((CAN.read() * 256.0) + CAN.read()) / 4.0;
}
float getKmh()
{
  if (useStandardAddressing) CAN.beginPacket(0x7df, 8);
  else CAN.beginExtendedPacket(0x18db33f1, 8);
  
  CAN.write(0x02); CAN.write(0x01); CAN.write(0x0D); CAN.endPacket();

  unsigned long currentMillis = millis();
  while (CAN.parsePacket() == 0 || CAN.read() < 3 || CAN.read() != 0x41 || CAN.read() != 0x0d) {
    if(millis() - currentMillis > TIMEOUT) {
      log_d("Read KM/h timeout");
      return 0;
    }
  }
  return (float)CAN.read();
}
int getAirTemp()
{
  if (useStandardAddressing) CAN.beginPacket(0x7df, 8);
  else CAN.beginExtendedPacket(0x18db33f1, 8);
  
  CAN.write(0x02); CAN.write(0x01); CAN.write(0x46); CAN.endPacket();

  unsigned long currentMillis = millis();
  while (CAN.parsePacket() == 0 || CAN.read() < 3 || CAN.read() != 0x41 || CAN.read() != 0x46) {
    if(millis() - currentMillis > TIMEOUT) {
      log_d("Read Air Temperature timeout");
      return 0;
    }
  }
  return CAN.read() - 40;
}