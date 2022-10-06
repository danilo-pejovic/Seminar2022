from django.template.defaulttags import url
from django.urls import include, path
from rest_framework import routers

from appointment import views

router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)
# router.register(r'appointments', views.GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('',include('appointment.urls')),
    path('',include('users.urls'))
]