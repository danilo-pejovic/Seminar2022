import datetime

def time_plus(time, timedelta):
    start = datetime.datetime(
        2000, 1, 1,
        hour=time.hour, minute=time.minute, second=time.second)
    end = start + timedelta
    return end.time()

def time_plus_date(date, timedelta):
    start = datetime.datetime(
        date.year, date.month, date.day,
        hour=0, minute=0, second=0)
    end = start + timedelta
    return end.date()