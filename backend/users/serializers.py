from rest_framework import serializers

from users.models import User,UserManager


class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'date_joined','password']