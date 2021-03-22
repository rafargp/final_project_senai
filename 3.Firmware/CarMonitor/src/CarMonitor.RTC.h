#include <RTClib.h>

RTC_DS3231 rtc;

char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

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
    return true;
}