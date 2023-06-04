from rest_framework import permissions
import logging


class IsProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            user = request.user
            return user.is_authenticated and user.is_provider
        return True

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)

class IsTimesloOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            user = request.user
            return user.is_authenticated and user.id
        return True

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)
    


class IsCalendarOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        if request.method in permissions.SAFE_METHODS:
            # Allow safe methods (GET, HEAD, OPTIONS) for all users
            return True
        
        return obj.owner == user or user.is_superuser
    
class IsTimeslotOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        if request.method in permissions.SAFE_METHODS:
            # Allow safe methods (GET, HEAD, OPTIONS) for all users
            return True
        
        return obj.owner == user or user.is_superuser or obj.calendar.owner == user
    
class IsSpecificUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        if request.method in permissions.SAFE_METHODS:
            # Allow safe methods (GET, HEAD, OPTIONS) for all users
            return True
        
        return obj.owner == user or user.is_superuser or obj.calendar.owner == user