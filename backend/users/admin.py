from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin



admin.site.register(User)