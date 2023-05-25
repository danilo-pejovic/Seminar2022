from django.shortcuts import render
from rest_framework import permissions, renderers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from schedule.models import Calendar, TimeSlot
from users.models import User
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse, JsonResponse
from users.serializers import  CalendarSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics
from schedule.serializers import TimeSlotSerializer, CalendarTimeSlotSerializer, TimeSlotUpdateSerializer, CalendarDeleteSerializer, TimeSlotSerializerPlayer


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 1000

class CalendarList(generics.ListCreateAPIView):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    filterset_fields = ('owner',)

    def perform_create(self, serializer):
      print(self.request)
      JWT_authenticator = JWTAuthentication()
      response = JWT_authenticator.authenticate(self.request)
      if response is not None:
        # unpacking
        user , token = response
        serializer.save(owner=user)
      else:
        print("no token is provided in the header or the header is missing")

class CalendarDetailList(generics.RetrieveAPIView):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer

class CalendarTimeSlotList(generics.ListAPIView):
  queryset = Calendar.objects.all()
  pagination_class = LargeResultsSetPagination
  serializer_class = CalendarTimeSlotSerializer



class CalendarTimeSlotDetailList(generics.ListAPIView):
  queryset = Calendar.objects.all()
  pagination_class = LargeResultsSetPagination
  serializer_class = CalendarTimeSlotSerializer

class CalendarDelete(generics.DestroyAPIView):
    queryset = Calendar.objects.all()
    serializer_class = CalendarDeleteSerializer
    



class TimeSlotList(generics.ListAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    pagination_class = LargeResultsSetPagination
    filterset_fields = ('calendar','timeslote_date')

class TimeSlotListPlayer(generics.ListAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializerPlayer
    pagination_class = LargeResultsSetPagination
    filterset_fields = ('calendar','timeslote_date', "owner")
    def get_queryset(self):
        queryset = TimeSlot.objects.all()
        queryset = queryset.order_by('timeslote_date', 'start_time')
        return queryset


class TimeSlotDetail(generics.RetrieveAPIView):
  queryset = TimeSlot.objects.all()
  serializer_class = TimeSlotSerializer



class TimeSlotUpdate(generics.UpdateAPIView):
  queryset = TimeSlot.objects.all()
  serializer_class = TimeSlotUpdateSerializer

  def perform_update(self, serializer):
        print(self.request)
        JWT_authenticator = JWTAuthentication()
        response = JWT_authenticator.authenticate(self.request)
        if response is not None:
         # unpacking
         user , token = response
         serializer.save(owner=user)
        else:
         print("no token is provided in the header or the header is missing")

class TimeSlotCancel(generics.UpdateAPIView):
  queryset = TimeSlot.objects.all()
  serializer_class = TimeSlotUpdateSerializer

  def perform_update(self, serializer):
        print(self.request)
        JWT_authenticator = JWTAuthentication()
        response = JWT_authenticator.authenticate(self.request)
        if response is not None:
         # unpacking
         calendar = serializer.instance.calendar
         serializer.save(owner=calendar.owner)
        else:
         print("no token is provided in the header or the header is missing")


