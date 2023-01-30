from django.template.defaulttags import url
from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken import views
from django.contrib import admin


router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    #path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('user/',include('users.urls')),
    path('api-token-auth/', views.obtain_auth_token),
    path('', include('schedule.urls')),
]