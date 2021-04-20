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

    rtc.adjust(DateTime(year,month,day,hour,minute,sec));
    delay(50);

    return true;
}
DateTime getCurrentDateTime(){
    DateTime now = rtc.now();
    while(now.year() < 2021) now = rtc.now();
    return now;
}
int getCurrentUnixtime(){
    DateTime now = getCurrentDateTime();

    if(unix_reference == -1) unix_reference = now.unixtime();
    int currntUnix = now.unixtime();

    while(currntUnix - unix_reference < 0) currntUnix = rtc.now().unixtime();
    
    return currntUnix;
}
String getTimeStampString(){
    DateTime now = getCurrentDateTime();
    char buff[] = "DD/MM/YYYY hh:mm";
    const char* result = now.toString(buff);
    return String(result);
}