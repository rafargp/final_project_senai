#define TINY_GSM_MODEM_SIM800

#include <TinyGsmClient.h>
#include <HardwareSerial.h>

//Definitions
#define MODEM_RST 5
#define MODEM_PWRKEY 4
#define MODEM_POWER_ON 23
#define MODEM_TX 27
#define MODEM_RX 26

//Variables
HardwareSerial SerialAT(1);
TinyGsm modem(SerialAT);
TinyGsmClient gsm_client(modem);
String gsm_ip,response;

const char* gsm_apn;
const char* gsm_user;
const char* gsm_pass;

void updateGSMDateTime(){
  
  log_d("Getting Status GSM");
  modem.sendAT(GF(""));
  modem.waitResponse(6000,response);
  log_d("Raw AT Response: %s",response.c_str());
  int16_t startOk = response.indexOf("O");
  if(response.substring(startOk,startOk+2) != "OK") {
    response = "";
    log_d("Set Date Time From GSM Network");
    modem.sendAT(GF("+CLTS=1;&W"));
    modem.waitResponse(1000,response);
    log_d("Raw AT Response: %s",response.c_str());
    ESP.restart();
  }
  response = "";
  
  log_d("Getting Date Time From GSM Network");
  modem.sendAT(GF("+CCLK?"));
  modem.waitResponse(6000,response);
  log_d("Raw AT Response: %s",response.c_str());

  int16_t a = response.indexOf("\"") + 1;
  int16_t b = response.indexOf("\"", a);
  response = response.substring(a, b);
  year = response.substring(0,2).toInt() + 2000;
  month = response.substring(3,5).toInt();
  day = response.substring(6,8).toInt();
  hour = response.substring(9,11).toInt();
  minute = response.substring(12,14).toInt();
  sec = response.substring(15,17).toInt();
  sec = response.substring(15,17).toInt();
  tz = response.substring(17,20).toInt() / 4;
  log_d("Date/Time: %i/%i/%i %i:%i:%i (%i)", day, month, year, hour, minute, sec, tz);
  response = "";
}
bool connect_gprs(){
  log_d("connceting to GPRS network");
  if(modem.isGprsConnected()) {
    log_d("modem already connected to the GPRS network");
    return true;
  }else{
    gsm_ip = "";
  }
  
  printOledTextSingleLine("Conctando a Internet\nAPN:"+String(gsm_apn));
  if (!modem.gprsConnect(gsm_apn, gsm_user, gsm_pass)) {
    log_e("gsm failed to connect to the GRPS network");
    ESP.restart();
  }
  return true;
}
bool getLocation(){
  log_d("getting date and location");
  bool result = modem.getGsmLocation(&lat, &lon, &accuracy, &year, &month, &day, &hour, &minute, &sec);
  
  log_d("Requesting current GSM location");
  if (result) {
      updateGSMDateTime();
      log_d("Accuracy: %f", accuracy);
      log_d("Location: %s,%s", String(lon, 10).c_str(), String(lat, 10).c_str());
      log_d("Date/Time: %i/%i/%i %i:%i:%i", day, month, year, hour, minute, sec);
  } else {
      log_d("Couldn't get GSM location");
  }
  return result;
}
void setup_gsm() {
  log_d("setting GSM variables");
  gsm_apn = config["gsm_apn"].as<char *>();
  gsm_user = config["gsm_user"].as<char *>();
  gsm_pass = config["gsm_pass"].as<char *>();
  
  log_d("config pin GSM modem");
  pinMode(MODEM_RST, OUTPUT);
  pinMode(MODEM_PWRKEY, OUTPUT);
  pinMode(MODEM_POWER_ON, OUTPUT);
  digitalWrite(MODEM_RST, HIGH);
  digitalWrite(MODEM_POWER_ON, HIGH);
  digitalWrite(MODEM_PWRKEY, HIGH);
  delay(500);
  digitalWrite(MODEM_PWRKEY, LOW);
  delay(1000);
  digitalWrite(MODEM_PWRKEY, HIGH);

  log_d("begin serial modem");
  SerialAT.begin(115200,SERIAL_8N1,MODEM_RX,MODEM_TX);
  delay(3000);

  log_d("begin GSM Modem");
  printOledTextSingleLine("Iniciando Modem GSM");
  
  log_d("getting Modem Informations");
  printOledTextSingleLine(modem.getModemInfo());
  
  log_d("waiting for operator network");
  printOledTextSingleLine("Aguardando Rede GSM");
  if (!modem.waitForNetwork()) {
    log_e("GSM Network failed");
    ESP.restart();
  }
  log_d("connected to operator network");
  printOledTextSingleLine("Conectado a rede");

  connect_gprs();
  log_i("connected to GSM Internet");
  
  log_i("Getting DateTime from GSM");
  
  printOledTextSingleLine("Setup GSM OK");
}

String getIP(){
  if(gsm_ip != "") return gsm_ip;
  gsm_ip = modem.localIP().toString();
  log_d("New IP: %s",gsm_ip.c_str());
  return gsm_ip;
}
int16_t getSignalQuality(){
  return modem.getSignalQuality();
}