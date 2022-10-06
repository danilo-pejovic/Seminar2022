from django.urls import path
from appointment import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('appointment/', views.AppoitmentList.as_view()),
    path('appointment/<int:pk>/', views.AppoitmentDetail.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)