from rest_framework import serializers
from schedule.models import Calendar, TimeSlot
from schedule.resources.time_choices import TIME_CHOICES

#TODO: figure out why calendarserializer refuses to import from here????

# class CalendarSerializer(serializers.Serializer):
#     id = serializers.IntegerField(read_only=True)
#     name=serializers.CharField()
#     start_date = serializers.DateField()
#     end_date = serializers.DateField()
#     opening_time_weekday = serializers.TimeField(choices=TIME_CHOICES)
#     closing_time_weekday = serializers.TimeField(choices=TIME_CHOICES)
#     opening_time_weekend = serializers.TimeField(choices=TIME_CHOICES)
#     closing_time_weekend = serializers.TimeField(choices=TIME_CHOICES)

#     def create(self, validated_data):
#         """
#         Create and return a new `Snippet` instance, given the validated data.
#         """
#         return Calendar.objects.create(**validated_data)

class TimeSlotUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['is_available']

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        ordering = ['id']
        model = TimeSlot
        fields = '__all__'


class CalendarTimeSlotSerializer(serializers.ModelSerializer):
    timeslots_owned=serializers.PrimaryKeyRelatedField(many=True, queryset=TimeSlot.objects.all())
    class Meta:
        model = Calendar
        fields = ['id','name','timeslots_owned']