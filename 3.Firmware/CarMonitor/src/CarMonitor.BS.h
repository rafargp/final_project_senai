#include <BluetoothSerial.h>

//Variables
BluetoothSerial SerialBT;
bool connected;
const char *b_name; 
const char *d_name;
const char *d_pass; 

void setup_bluetooth() {
  log_d("begin bluetooth as Master");

  b_name = DEVICE_ID.c_str();
  d_name = config["bluetooth_device"].as<char *>();
  d_pass = config["bluetooth_pin"].as<char *>(); 

  printOledTextSingleLine("Iniciando Bluetooth\n\nNome:"+String(b_name));
  SerialBT.begin(DEVICE_ID.c_str(), true); 
  delay(1000);

  printOledTextSingleLine("Conectando Bluetooth\n\nDevice:"+String(d_name)+"\nSenha:"+String(d_pass));

  log_d("bluetooth trying to connect");
  connected = SerialBT.connect(d_name);
  SerialBT.setPin(d_pass);   

  if(connected) {
    printOledTextSingleLine("Bluetooth Conectado");
  } else {
    log_e("Error when try to conect to bletooth");
    ESP.restart();
  }

  if (SerialBT.disconnect()) {
    printOledTextSingleLine("Bluetooth Desconectado");
  }
  SerialBT.connect();  
}