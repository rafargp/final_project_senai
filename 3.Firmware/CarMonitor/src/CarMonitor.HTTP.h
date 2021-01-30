#include <HttpClient.h>
#include <Update.h>

void FW_Update(const char *host, int port, const char *path, const char *method)
{
    log_d("update firmaware");
    int err = 0;
    log_d("making a requesting to host (%s): %s:%i%s",method,host,port,path);
    HttpClient http(gsm_client,host,port);
    err = http.startRequest(path, method);
    if (err == 0) {
        err = http.responseStatusCode();
        log_d("Request Status: %i",err);
        if (err >= 0) {
            err = http.skipResponseHeaders();
            if (err >= 0) {
                int bodyLen = http.contentLength();
                int remaining = bodyLen;
                int totalReceived = 0;
                int received;
                uint8_t buff[2048] = {0};
                log_w("Start Update Firmware");
                printOledTextSingleLine("Iniciando Atualizacao de Firmware");
                delay(500);
                if (!Update.begin(bodyLen)) Update.printError(Serial);

                while (http.available() && remaining > 0)
                {
                    printOledTextSingleLine("Atualizando..." + String(totalReceived * 100 / bodyLen) + "%");
                    received = http.readBytes(buff, ((remaining > sizeof(buff)) ? sizeof(buff) : remaining));

                    Update.write(buff, received);
                    if (remaining > 0) remaining -= received;
                    totalReceived += received;
                    yield();
                }
                if (Update.end(true))
                {
                    log_i("Update Successful");
                    printOledTextSingleLine("Firmware Atualizado!\nReiniciando...");
                    delay(500);
                    ESP.restart();
                }
                else
                {
                    log_e("Update Error");
                    Update.printError(Serial);
                }
            }
            else
            {
                log_e("Failed to skip response headers: %i",err);
            }
        }
        else
        {
            log_e("Getting response failed: %i",err);
        }
    }
    else
    {
        log_e("HTTP Request failed: %i",err);
    }
    http.stop();
    return;
}

String requestBody(const char *host, int port, const char *path, const char *method)
{
    log_d("HTTP Request");
    int err = 0;
    HttpClient http(gsm_client,host, port);
    String body = "";
    log_d("making a requesting to host (%s): http://%s:%i%s",method,host,port,path);
    err = http.startRequest(path, method, NULL);
    if (err == 0) {
        err = http.responseStatusCode();
        log_d("Request Status: %i",err);
        if (err >= 0) {
            err = http.skipResponseHeaders();
            log_d("Request Skip Headers: %i",err);
            if (err >= 0) {
                int bodyLen = http.contentLength();

                while ((http.connected() || http.available()))
                {
                    if (http.available())
                    {
                        body += (char)http.read();
                        bodyLen--;
                    }
                }
                log_d("Response Body: %s",body.c_str());
            }
            else
            {
                log_e("Failed to skip response headers: %i",err);
            }
        }
        else
        {
            log_e("Getting response failed: %i",err);
        }
    }
    else
    {
        log_e("HTTP Request failed: %i",err);
    }
    http.stop();
    return body;
}
