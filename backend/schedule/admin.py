from django.contrib import admin
from schedule.models import Calendar, TimeSlot


admin.site.register(Calendar)
admin.site.register(TimeSlot)
