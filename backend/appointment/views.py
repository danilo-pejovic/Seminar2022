from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from appointment.models import Appoitment
from appointment.serializers import AppointmentSerializer
from rest_framework.decorators import api_view
from rest_framework import status, generics
from rest_framework.response import Response
from django.contrib.auth.models import User
from appointment.serializers import UserSerializer
from rest_framework import permissions
from appointment.permissions import IsOwnerOrReadOnly
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'appointments': reverse('appointment-list', request=request, format=format)
    })

class AppoitmentList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Appoitment.objects.all()
    serializer_class = AppointmentSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly,
     #                     IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AppoitmentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appoitment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly]


# class UserList(generics.ListAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#
#
# class UserDetail(generics.RetrieveAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# @api_view(['GET', 'POST'])
# def appoitment_list(request):
#     """
#     List all code snippets, or create a new snippet.
#     """
#     if request.method == 'GET':
#         snippets = Appoitment.objects.all()
#         serializer = AppointmentSerializer(snippets, many=True)
#         return Response(serializer.data)
#
#
#     elif request.method == 'POST':
#         serializer = AppointmentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
#
# @api_view(['GET', 'PUT', 'DELETE'])
# def appoitment_detail(request, pk):
#     """
#     Retrieve, update or delete a code snippet.
#     """
#     try:
#         snippet = Appoitment.objects.get(pk=pk)
#     except Appoitment.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     if request.method == 'GET':
#         serializer = AppointmentSerializer(snippet)
#         return Response(serializer.data)
#
#     elif request.method == 'PUT':
#         serializer = AppointmentSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     elif request.method == 'DELETE':
#         snippet.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
