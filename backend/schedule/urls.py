from django.urls import path
from schedule import views

urlpatterns = [
    path('schedule/', views.CalendarList.as_view()),
    path('schedule/<int:pk>/', views.CalendarDetailList.as_view()),
    path('schedule/timeslots/', views.TimeSlotList.as_view()),
    path('schedule/timeslots/<int:pk>/', views.TimeSlotDetail.as_view()),
    path('schedule/calendar_timeslots/', views.CalendarTimeSlotList.as_view()),
    path('schedule/timeslots/update/<int:pk>/', views.TimeSlotUpdate.as_view()),
    path('schedule/timeslots/delete/<int:pk>/', views.TimeSlotCancel.as_view()),
    path('schedule/delete/<int:pk>/', views.CalendarDelete.as_view()), 
    path('schedule/timeslots/player/', views.TimeSlotListPlayer.as_view()),
]