#include <RTClib.h>

RTC_DS3231 rtc;
int unix_reference;

bool setupRTC()
{
    if (!rtc.begin())
    {
        log_e("Couldn't find RTC");
        return false;
    }

    delay(50);
    rtc.adjust(DateTime(year,month,day,hour,minute,sec));
    delay(50);

    DateTime now = rtc.now();
    unix_reference = now.unixtime();
    log_d("DateTime: %i/%i/%i %i:%i:%i", now.day(),now.month(),now.year(),now.hour(),now.minute(),now.second());
    return true;
}
int getCurrentDateTime(){
    int currntUnix = rtc.now().unixtime();
    while(currntUnix - unix_reference <= 0) currntUnix = rtc.now().unixtime();
    return currntUnix;
}
String getTimeStampString(){
    DateTime now = rtc.now();
    char buff[] = "DD/MM/YYYY hh:mm";
    const char* result = now.toString(buff);
    return String(result);
}