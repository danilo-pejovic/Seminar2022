from django.db import models
from  .resources.time_choices import TIME_CHOICES
from schedule.resources.time_delta_plus_operant import time_plus,time_plus_date
import datetime
from users.models import User
# Create your models here.


class Calendar(models.Model):
    name=models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    opening_time_weekday = models.TimeField(choices=TIME_CHOICES)
    closing_time_weekday = models.TimeField(choices=TIME_CHOICES)
    opening_time_weekend = models.TimeField(choices=TIME_CHOICES)
    closing_time_weekend = models.TimeField(choices=TIME_CHOICES)
    owner = models.ForeignKey(User,  related_name='calendars_owned',on_delete=models.CASCADE)
    class Meta:
        ordering = ['id']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.create_time_slots()

    def create_time_slots(self):
        # Get the current date
        # Create a start for the time slots
        #start_date = self.start_date
        #end_date = self.end_date
        # Create the time slots
        current_date = self.start_date
        while current_date < self.end_date:
            
            if current_date.isoweekday() <= 5:
             #start_timedelta=datetime.timedelta(hours=self.opening_time_weekday.hour,minutes=self.opening_time_weekday.minute)
             current_time=self.opening_time_weekday
             while current_time < self.closing_time_weekday:
              TimeSlot.objects.create(calendar=self,start_time=current_time,timeslote_date=current_date, is_available=True,owner=self.owner)
              current_time = time_plus(current_time,datetime.timedelta(minutes=30))
            elif current_date.isoweekday() > 5:
             current_time=self.opening_time_weekend
             while current_time < self.closing_time_weekend:
              TimeSlot.objects.create(calendar=self, start_time=current_time, timeslote_date=current_date, is_available=True, owner=self.owner)
              current_time = time_plus(current_time,datetime.timedelta(minutes=30))
            current_date = time_plus_date(current_date,datetime.timedelta(days=1))

class TimeSlot(models.Model):
    calendar = models.ForeignKey(Calendar,related_name='timeslots_owned', on_delete=models.CASCADE)
    start_time = models.TimeField()
    timeslote_date=models.DateField()
    is_available=models.BooleanField('Is timeslot available?', default=False)
    owner = models.ForeignKey(User,related_name='timeslots_rented', on_delete=models.CASCADE, blank=True,null=True)

    def __str__(self):
        return f'Time slot from {self.start_time} that lasts 30 mins'
