from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from users.models import User
from rest_framework.decorators import api_view
from rest_framework import status, generics
from rest_framework.response import Response
from users.serializers import UserSerializer
from rest_framework import permissions
from appointment.permissions import IsOwnerOrReadOnly
from rest_framework.reverse import reverse
# Create your views here.

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer



class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer