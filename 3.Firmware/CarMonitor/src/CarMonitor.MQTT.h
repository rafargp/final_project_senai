#include <PubSubClient.h>

//Variables
uint8_t message_char_buffer[MQTT_MAX_PACKET_SIZE];
const char *mqtt_server;
int mqtt_port;
const char *mqtt_user;
const char *mqtt_pass;
char *mqtt_sensors;
char *mqtt_register_device;
char *mqtt_register_car;
char *mqtt_login_device;
char *mqtt_login_car;
char *mqtt_health;

PubSubClient client(gsm_client);

void sendSensorData(){
    if (CAR_ID == "") return;

    log_d("send sensor data");
       
    log_d("requesting sensor data");
    
    float rpm = getRPM();
    float kmh = getKmh();

    if(rpm == 0 && kmh == 0) return;

    log_d("creating json payload");
    StaticJsonDocument<512> json;
    
    json["car_id"] = CAR_ID;
    JsonArray sensors = json.createNestedArray("sensors");
    JsonObject sensors_0 = sensors.createNestedObject();
    sensors_0["pid"] = "0C";
    sensors_0["sensor"] = "Engine Speed";
    sensors_0["unit"] = "RPM";
    sensors_0["value"] = rpm;
    JsonObject sensors_1 = sensors.createNestedObject();
    sensors_1["pid"] = "0D";
    sensors_1["sensor"] = "Vehicle Speed";
    sensors_1["unit"] = "Km/h";
    sensors_1["value"] = kmh;
    JsonObject sensors_2 = sensors.createNestedObject();
    sensors_2["pid"] = "46";
    sensors_2["sensor"] = "Ambient Air Temperature";
    sensors_2["unit"] = "Celsius";
    sensors_2["value"] = getAirTemp();

    String payload = "";
    serializeJson(json, payload);

    const char *c_payload = payload.c_str();
    log_d("payload: %s", c_payload);
    int p_length = strlen(c_payload);
    log_d("publishing payload to topic: %s", mqtt_sensors);
    boolean result = client.publish(mqtt_sensors, c_payload, p_length);
    if (result) log_i("sensor payload sent");
    else log_e("failed to publish sent payload");
    delay(10);
}
void sendHealthStatus(){
    if (DEVICE_ID == "") return;

    log_d("send health status");

    log_d("update gsm data to sent");
    if(!getLocation()) return;
        
    log_d("creating json payload");
    StaticJsonDocument<256> json;
        
    json["device_id"] = DEVICE_ID;
    json["ip"] = getIP();
    json["signal"] = getSignalQuality();
    json["gsm_date"] = String(year) + "-" + String(month) + "-" + String(day);
    json["gsm_time"] = String(hour) + ":" + String(minute) + ":" + String(sec);
    json["location_lo"] = String(lon, 8);
    json["location_la"] = String(lat, 8);
    json["location_accuracy"] = String(accuracy);
    
    String payload = "";
    serializeJson(json, payload);
    const char *c_payload = payload.c_str();
    log_d("payload: %s", c_payload);
    int p_length = strlen(c_payload);
    log_d("publishing payload to topic: %s", mqtt_health);
    boolean result = client.publish(mqtt_health, c_payload, p_length);
    if (result) log_i("health payload sent");
    else log_e("failed to publish health payload");
    delay(100);
}
void registerDevice()
{
    if (DEVICE_ID != "") return;

    log_d("register device");
    printOledTextSingleLine("Registrando Dispositivo");
    log_d("creating json payload");
    StaticJsonDocument<256> json;
    json["imei"] = modem.getIMEI();
    json["ccid"] = modem.getSimCCID();
    json["imsi"] = modem.getIMSI();
    json["operator"] = modem.getOperator();
    json["board"] = "ESP32";
    json["version"] = FW_VERSION;
    String payload = "";
    serializeJson(json, payload);
    const char *c_payload = payload.c_str();
    log_d("payload: %s", c_payload);
    int p_length = strlen(c_payload);
    log_d("publishing payload to topic: %s", mqtt_register_device);
    boolean result = client.publish(mqtt_register_device, c_payload, p_length);
    if (result) log_i("register payload sent");
    else log_e("failed to publish register payload");
    delay(100);
}
void registerCar()
{
    if (CAR_ID != "") return;

    log_d("register car");
    printOledTextSingleLine("Registrando Carro");
    log_d("creating json payload");

    String VIN = "";
    int max_try = 5;
    while(VIN == "") {
        if(max_try <= 0) {
            log_w("Could not get VIN CAR");
            ESP.restart(); 
        }
        log_d("Trying to get VIN CAR: %i",(5-max_try)+1);
        VIN = getVINCar();
        max_try--;
    }

    StaticJsonDocument<256> json;
    json["deviceId"] = DEVICE_ID;
    json["carVIN"] = VIN;
    json["carSensor"] = getSupportedPIDs();
    String payload = "";
    serializeJson(json, payload);
    const char *c_payload = payload.c_str();
    log_d("payload: %s", c_payload);
    int p_length = strlen(c_payload);
    log_d("publishing payload to topic: %s", mqtt_register_car);
    boolean result = client.publish(mqtt_register_car, c_payload, p_length);
    if (result) log_i("register payload sent");
    else log_e("failed to publish register payload");
    delay(100);
}
void loginDevice(byte *payload)
{
    log_d("Login device");
    DynamicJsonDocument device(128);
    if (!deserializeJson(device, payload))
    {
        DEVICE_ID = device["id"].as<String>();
        printOledTextSingleLine("Dispositivo Registrado\nID:" + DEVICE_ID);
        log_d("unsubscribing login topic");
        boolean result = client.unsubscribe(mqtt_login_device);
        log_d("unsubscribe login topic: %d", result);
        log_d("Calling Register Car");
        registerCar();
    }
    else
    {
        log_e("error to deserialize login payload");
        registerDevice();
    }
    delay(500);
}
void loginCar(byte *payload)
{
    log_d("Login car");
    DynamicJsonDocument device(128);
    if (!deserializeJson(device, payload))
    {
        CAR_ID = device["id"].as<String>();
        printOledTextSingleLine("Carro Registrado\nID:" + CAR_ID);
        log_d("unsubscribing login topic");
        boolean result = client.unsubscribe(mqtt_login_car);
        log_d("unsubscribe login topic: %d", result);
    }
    else
    {
        log_e("error to deserialize login payload");
        registerCar();
    }
    delay(500);
}
void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    log_d("MQTT Callback");
    String strPayload = "";

    for (int i = 0; i < length; i++) strPayload += (char)payload[i];
    log_d("Receive MQTT message (topic: %s | payload: %s)", topic, strPayload.c_str());

    if (strcmp(topic, mqtt_login_device) == 0) loginDevice(payload);
    else if (strcmp(topic, mqtt_login_car) == 0) loginCar(payload);
    else log_e("Topic is not implemented %s", topic);
}
void setupMQTT()
{
    log_d("setting up MQTT");
    printOledTextSingleLine("Configurando MQTT");

    mqtt_server = config["mqtt_server"].as<char *>();
    mqtt_port = config["mqtt_port"].as<int>();
    mqtt_user = config["mqtt_user"].as<char *>();
    mqtt_pass = config["mqtt_pass"].as<char *>();

    log_i("MQTT_Server: mqtt://%s:%i", mqtt_server, mqtt_port);
    client.setServer(mqtt_server, mqtt_port);
    log_d("Setting MQTT Callback");
    client.setCallback(mqttCallback);
    printOledTextSingleLine("Configurando MQTT - OK");
}
void connectMQTT()
{
    while (!client.connected())
    {
        log_d("MQTT is not connected");
        connect_gprs();

        log_d("Connecting to MQTT server");
               
        if (client.connect(DEVICE_ID.c_str(), mqtt_user, mqtt_pass))
        {
            printOledTextSingleLine("MQTT Conectado");
            log_i("MQTT Connected");
            JsonArray topics = config["mqtt_topics"].as<JsonArray>();
            log_d("MQTT subscribing to topics");
            for (int x = 0; x <= topics.size() - 1; x++)
            {
                const char *method = topics[x]["method"].as<const char *>();
                const char *isFor = topics[x]["for"].as<const char *>();

                if (strcmp(isFor, "sensors") == 0) mqtt_sensors = (char *)topics[x]["topic"].as<char *>();
                else if (strcmp(isFor, "register_device") == 0) mqtt_register_device = (char *)topics[x]["topic"].as<char *>();
                else if (strcmp(isFor, "register_car") == 0) mqtt_register_car = (char *)topics[x]["topic"].as<char *>();
                else if (strcmp(isFor, "login_device") == 0) mqtt_login_device = (char *)topics[x]["topic"].as<char *>();
                else if (strcmp(isFor, "login_car") == 0) mqtt_login_car = (char *)topics[x]["topic"].as<char *>();
                else if (strcmp(isFor, "health") == 0) mqtt_health = (char *)topics[x]["topic"].as<char *>();
                if (strcmp(method, "publish") == 0) continue;

                const char *topic = topics[x]["topic"].as<const char *>();
                boolean result = client.subscribe(topic);

                log_i("MQTT topic %s | result: %d", topic, result);

                delay(100);
            }
            if(DEVICE_ID == "" || CAR_ID == "") registerDevice();
        }
        else
        {
            log_e("MQTT connecting - Error: %s", client.state());
            delay(500);
        }
    }
    client.loop();
}