from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Grievance, Department, GrievanceUpdate
from .serializers import (
    GrievanceSerializer, GrievanceCreateSerializer,
    DepartmentSerializer, GrievanceUpdateSerializer
)

class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]

class SubmitGrievanceView(generics.CreateAPIView):
    serializer_class = GrievanceCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        is_anon = serializer.validated_data.get('is_anonymous', False)
        student = None if is_anon else self.request.user
        serializer.save(student=student)

class MyGrievancesView(generics.ListAPIView):
    serializer_class = GrievanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Grievance.objects.filter(student=self.request.user).order_by('-created_at')

class TrackGrievanceView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, tracking_id):
        try:
            grievance = Grievance.objects.get(tracking_id=tracking_id)
            serializer = GrievanceSerializer(grievance)
            return Response(serializer.data)
        except Grievance.DoesNotExist:
            return Response({"error": "Grievance not found."}, status=404)

class AdminGrievanceListView(generics.ListAPIView):
    serializer_class = GrievanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Grievance.objects.all().order_by('-created_at')
        status_filter = self.request.query_params.get('status')
        category = self.request.query_params.get('category')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if category:
            qs = qs.filter(category=category)
        return qs

class UpdateGrievanceStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            grievance = Grievance.objects.get(pk=pk)
            new_status = request.data.get('status')
            response_msg = request.data.get('admin_response', '')
            grievance.status = new_status
            grievance.admin_response = response_msg
            grievance.save()
            GrievanceUpdate.objects.create(
                grievance=grievance,
                updated_by=request.user,
                message=response_msg,
                status_changed_to=new_status
            )
            return Response({"message": "Status updated successfully."})
        except Grievance.DoesNotExist:
            return Response({"error": "Not found."}, status=404)

class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total = Grievance.objects.count()
        pending = Grievance.objects.filter(status='pending').count()
        in_progress = Grievance.objects.filter(status='in_progress').count()
        resolved = Grievance.objects.filter(status='resolved').count()
        return Response({
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "resolved": resolved,
        })