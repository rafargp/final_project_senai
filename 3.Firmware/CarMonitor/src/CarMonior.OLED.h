#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

//Definitions
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

//Variables
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

String buffer;

bool setupOled()
{
    log_d("begin OLED");
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
    {
        log_e("Error when begin OLED");
        Serial.println(F("Falha na alocação do OLED SSD1306"));
        return false;
    }
    log_d("begin OLED Competed");
    log_d("setup OLED parameters");
    display.setTextSize(1);
    display.setTextColor(WHITE);
    log_d("setup OLED parameters Completed");
    delay(100);
    return true;
}
void printOledTextSingleLine(String text,bool serial=true)
{
    //log_d("print OLED (Serial | Text): (%d | %s)",serial,text.c_str());
    if(serial) Serial.println(text);
    if(buffer == text) return;
    buffer = text;
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println(text);
    display.display();
    delay(100);
}