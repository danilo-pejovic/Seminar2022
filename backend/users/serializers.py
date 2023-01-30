
from users.models import User#,UserManager
from rest_framework import serializers, fields
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from schedule.models import Calendar, TimeSlot
from schedule.resources.time_choices import TIME_CHOICES

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    #is_provider=serializers.BooleanField(required=True, initial=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        
        user.set_password(validated_data['password'])
        user.save()

        return user

class UserSerializer(serializers.ModelSerializer):
   calendars_owned=serializers.PrimaryKeyRelatedField(many=True, queryset=Calendar.objects.all())

   class Meta:
        model = User
        fields = ['id', 'username', 'calendars_owned', "is_provider"]
   
class UserTimeSlotSerializer(serializers.ModelSerializer):
    timeslots_rented=serializers.PrimaryKeyRelatedField(many=True, queryset=TimeSlot.objects.all())
    class Meta:
        model = User
        fields = ['id','name','timeslots_rented']

class UserDetailSerializer(serializers.ModelSerializer):
   calendars_owned=serializers.PrimaryKeyRelatedField(many=True, queryset=Calendar.objects.all())

   class Meta:
        model = User
        fields = ['id', 'username', 'calendars_owned', 'is_provider']


#TODO: validate that calendar end date is after start date and opening is before closing
class CalendarSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField(initial="2013-01-29")
    end_date = serializers.DateField(initial="2013-01-29")
    opening_time_weekday = serializers.ChoiceField(choices=TIME_CHOICES)
    closing_time_weekday = serializers.ChoiceField(choices=TIME_CHOICES)
    closing_time_weekend = serializers.ChoiceField(choices=TIME_CHOICES)
    opening_time_weekend = serializers.ChoiceField(choices=TIME_CHOICES)
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Calendar
        fields = ['id', 'name','start_date', 'end_date', 'opening_time_weekday', 'closing_time_weekday','opening_time_weekend','closing_time_weekend','owner' ]




