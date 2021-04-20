#include <RTClib.h>

RTC_DS3231 rtc;
int unix_reference = -1;

bool setupRTC()
{
    if (!rtc.begin())
    {
        log_e("Couldn't find RTC");
        return false;
    }
    delay(50);
    printOledTextSingleLine("Atualizando Data e Hora");

    delay(50);
    while(year < 2021) updateGSMDateTime();
    
    delay(50);
    DateTime now = DateTime(year,month,day,hour,minute,sec);
    unix_reference = now.unixtime();
    rtc.adjust(now);
    
    return true;
}
int getCurrentUnixtime(){
    DateTime now = rtc.now();
    int currntUnix = now.unixtime();
    while(currntUnix - unix_reference < 0) currntUnix = rtc.now().unixtime();
    return currntUnix;
}
String getTimeStampString(){
    DateTime now = rtc.now();
    char buff[] = "DD/MM/YYYY hh:mm";
    const char* result = now.toString(buff);
    return String(result);
}