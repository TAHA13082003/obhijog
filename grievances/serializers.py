from rest_framework import serializers
from .models import Grievance, Department, GrievanceUpdate

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class GrievanceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrievanceUpdate
        fields = '__all__'

class GrievanceSerializer(serializers.ModelSerializer):
    updates = GrievanceUpdateSerializer(many=True, read_only=True)
    tracking_id = serializers.UUIDField(read_only=True)

    class Meta:
        model = Grievance
        fields = '__all__'
        read_only_fields = ('student', 'status', 'admin_response', 'tracking_id')

class GrievanceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grievance
        fields = ('title', 'description', 'category', 'urgency', 'department', 'is_anonymous')