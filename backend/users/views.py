
from django.http import JsonResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from users.serializers import UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, UserDetailSerializer, ChangePasswordSerializer
from rest_framework import generics
from .models import User
from users.permissions import ChangePasswordPermission


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['is_provider'] = user.is_provider
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/user/token',
        '/user/token/refresh',
    ]

    return Response(routes)

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_fields = ('is_provider',)



class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer



class ChangePasswordView(generics.UpdateAPIView):

    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated, ChangePasswordPermission)
    serializer_class = ChangePasswordSerializer