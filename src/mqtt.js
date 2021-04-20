//Cliente MQTT para gereciamento do protocolo
var mqttClient;

//Objeto MQTT com funções pertinentes ao protocolo
const MQTT = {
    connect: function (host,port,user,pass,clientId,onMessageArrived=this.onMessageArrived) {
        let mqtt = new Paho.MQTT.Client(host, port, clientId);
        mqtt.onConnectionLost = this.onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;
        mqtt.onConnected = this.onConnected;
        var options = {
            timeout: 10,
            cleanSession: false,
            onSuccess: this.onConnect,
            onFailure: this.onFailure,
            userName: user,
            password: pass,
        };
        mqtt.connect(options);
        mqttClient = mqtt;
    },
    onConnectionLost: function (responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log(responseObject)
            console.log("MQTT -> onConnectionLost:" + responseObject.errorMessage);
        }
    },
    onMessageArrived: function (message) {
        var msg = message.payloadString;
        console.log(`MQTT -> onMessageArrived: ${msg}`)
        console.log(`MQTT -> processando mensagem`)
    },
    onFailure: function (message) {
        console.log("MQTT -> onFailure: Falha");
        setTimeout(MQTTconnect, 2000);
    },    
    onConnected: function (recon, url) {
        console.log("MQTT -> onConnected: " + reconn);
    },
    onConnect: function () {
        console.log("MQTT -> onConnect: " + mqttClient.isConnected());
    },
    subscribe: function (stopic, sqos) {
    
        if (!mqttClient.isConnected()) {
            console.log("MQTT -> Não conectado, nao poderá subscrever");
            return;
        }
    
        if (sqos > 2) sqos = 0;
        var soptions = { qos: sqos };
        mqttClient.subscribe(stopic, soptions);
    },
    disconnect: function () {
        if (mqttClient.isConnected()) mqttClient.disconnect();
    },    
    sendMessage: function (topic, msg, retain_flag, pqos) {
        if (!mqttClient.isConnected()) {
            console.log("MQTT -> Não conectado, nao poderá enviar");
            return;
        }
        console.log(`MQTT -> Enviando mensagem: "${msg}", Tópico: "${topic}", Retain: "${retain_flag}", QoS: ${pqos}`);
        if (pqos > 2) pqos = 0;
        message = new Paho.MQTT.Message(msg);
        message.destinationName = topic;
        message.qos = pqos;
        message.retained = retain_flag;
        mqttClient.send(message);
    }
}