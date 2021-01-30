void setupFileConfig(bool reset)
{
  log_d("setting configuration file");
  if (!fileExist(SPIFFS, "/", "/config.json", 0))
  {
    printOledTextSingleLine("Arquivo de Configuracao\nconfig.json nao existe");
    log_e("File config.json does not exists");
    log_e("Please, upload configuration file");
    ESP.restart();
  }
  log_d("setting configuration file OK");
}

void getConfig()
{
  log_d("getting configuration file");
  printOledTextSingleLine("Carregando Arquivo:\nconfig.json");
  setupFileConfig(false);
  log_d("reading configuration file");
  printOledTextSingleLine("Lendo Arquivo de Configuracao");
  String configFile = readFile(SPIFFS, "/config.json");
  log_d("deserializing configuration file to JSON");
  DeserializationError err = deserializeJson(config, configFile);
  if (err)
  {
    log_e("error reading configuration: %s",err);
    delay(500);
    log_e("Removing Configuration File");
    deleteFile(SPIFFS, "/config.json");
    log_e("Restarting...");
    ESP.restart();
  }
  log_i("configuration file: %s",configFile.c_str());
  printOledTextSingleLine("Arquivo de Configuracao - OK");
}
void updateConfiguration(bool force_sync){
  log_d("updating configuration");
  bool sync = (bool)config["sync"].as<int>();
  
  if (sync && !force_sync) {
    log_i("skip update due variables (sync:%d | force_sync:%d)",sync,force_sync);
    return;
  }
  printOledTextSingleLine("Atualizando Configuracao");
  
  String response = requestBody(config["config_host"].as<char *>(), config["config_port"].as<int>(), config["config_path"].as<char *>(), "GET");
  
  if (response.isEmpty())
  {
    log_e("error to connect to the server: %s",config["config_host"].as<char *>());
    setupFileConfig(true);
    delay(1000);
    ESP.restart();
  }
  log_i("rewriting configuration file with payload: %s",response.c_str());
  writeFile(SPIFFS, "/config.json", (const char *)response.c_str());
  log_d("deserializing configuration file to JSON");
  DeserializationError err = deserializeJson(config, response);
  if (err)
  {
    log_e("error reading configuration: %s",err);
    delay(500);
    log_e("Removing Configuration File");
    deleteFile(SPIFFS, "/config.json");
    log_e("Restarting...");
    ESP.restart();
  }
  log_i("updated configuration file");
  printOledTextSingleLine("Arquivo de Configuracao Atualizado");
}
void checkUpdate(String payload)
{
  log_d("checking for updates");
  if (payload.isEmpty())
  {
    log_i("no payload for update");
    payload = requestBody(config["update_host"].as<char *>(), config["update_port"].as<int>(), config["update_path"].as<char *>(), config["update_method"].as<char *>());
  }
  DynamicJsonDocument update(300);
  if (!deserializeJson(update, payload))
  {
    if (update["version"].as<float>() > FW_VERSION)
    {
      log_d("found update (%f) for this version %f",update["version"].as<float>(),FW_VERSION);
      FW_Update(update["update_host"].as<char *>(), update["update_port"].as<int>(), update["update_path"].as<char *>(), update["update_method"].as<char *>());
    }
    else
    {
      log_i("System is up-to-date: V%f",FW_VERSION);
      printOledTextSingleLine("Sistema Atualizado\n\nFirmware: V"+String(FW_VERSION));
    }
  }
  delay(1000);
}
