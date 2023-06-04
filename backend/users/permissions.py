from rest_framework import permissions



class ChangePasswordPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        
        return obj == user 