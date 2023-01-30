from django.urls import path
from schedule import views

urlpatterns = [
    path('schedule/', views.CalendarList.as_view()),
    path('schedule/timeslots/', views.TimeSlotList.as_view()),
    path('schedule/timeslots/<int:pk>/', views.TimeSlotDetail.as_view()),
    path('schedule/calendar_timeslots/', views.CalendarTimeSlotList.as_view()),
    path('schedule/timeslots/update/<int:pk>/', views.TimeSlotUpdate.as_view())
]