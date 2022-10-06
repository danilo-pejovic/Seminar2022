from rest_framework import serializers
from appointment.models import Appoitment
from django.contrib.auth.models import User

class AppointmentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    part_of_body = serializers.CharField(required=True, allow_blank=False, max_length=100)
    description = serializers.CharField(style={'base_template': 'textarea.html'})
    noticed_symptoms_when=serializers.CharField(required=True, allow_blank=False, max_length=100)
    created=serializers.DateTimeField(required=False)
    def create(self, validated_data):
        """
        Create and return a new `Appoitment` instance, given the validated data.
        """
        return Appoitment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Appoitment` instance, given the validated data.
        """
        instance.part_of_body = validated_data.get('part_of_body', instance.part_of_body)
        instance.description = validated_data.get('description', instance.description)
        instance.noticed_symptoms_when = validated_data.get('noticed_symptoms_when', instance.noticed_symptoms_when)
        instance.save()
        return instance

    class Meta:
        model = Appoitment
        fields = ('url', 'id', 'highlight', 'owner', 'part_of_body', 'description',
                  'noticed_symptoms_when')



class UserSerializer(serializers.ModelSerializer):
    snippets = serializers.PrimaryKeyRelatedField(many=True, queryset=Appoitment.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'appoitment']