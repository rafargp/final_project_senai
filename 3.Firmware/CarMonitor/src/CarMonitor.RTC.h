#include <RTClib.h>

RTC_DS3231 rtc;

bool setupRTC()
{
    if (!rtc.begin())
    {
        log_e("Couldn't find RTC");
        return false;
    }

    if (rtc.lostPower())
    {
        log_w("RTC lost power, lets set the time!");
        rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    }
    DateTime now = rtc.now();
    log_d("DateTime: %i/%i/%i %i:%i:%i", now.day(),now.month(),now.year(),now.hour(),now.minute(),now.second());
    return true;
}
String getTimeStampString(){
    
    //buffer can be defined using following combinations:
    //hh - the hour with a leading zero (00 to 23)
    //mm - the minute with a leading zero (00 to 59)
    //ss - the whole second with a leading zero where applicable (00 to 59)
    //YYYY - the year as four digit number
    //YY - the year as two digit number (00-99)
    //MM - the month as number with a leading zero (01-12)
    //MMM - the abbreviated English month name ('Jan' to 'Dec')
    //DD - the day as number with a leading zero (01 to 31)
    //DDD - the abbreviated English day name ('Mon' to 'Sun')

    DateTime now = rtc.now();
    if(now.day() == 0) rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    char buf[] = "DD/MM/YYYY hh:mm:ss";
    const char* result = now.toString(buf);
    return String(result);
}