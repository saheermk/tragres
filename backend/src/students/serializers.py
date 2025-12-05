"""
Serializers for Student API
"""
from rest_framework import serializers
from .models import Student, AttendanceRecord, Assignment


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """Serializer for attendance records"""
    class Meta:
        model = AttendanceRecord
        fields = ['id', 'date', 'present', 'topic', 'created_at']


class AssignmentSerializer(serializers.ModelSerializer):
    """Serializer for assignments"""
    assignedDate = serializers.DateField(source='assigned_date')
    completedDate = serializers.DateField(source='completed_date', allow_null=True, required=False)

    class Meta:
        model = Assignment
        fields = ['id', 'title', 'completed', 'assignedDate', 'completedDate']


class StudentSerializer(serializers.ModelSerializer):
    """Serializer for student profiles with nested attendance and assignments"""
    attendance = AttendanceRecordSerializer(many=True, read_only=True)
    assignments = AssignmentSerializer(many=True, read_only=True)
    profilePhoto = serializers.CharField(source='profile_photo', allow_blank=True, required=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'name', 'phone', 'email', 'course', 
            'profilePhoto', 'attendance', 'assignments', 'createdAt'
        ]


class StudentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating students"""
    profilePhoto = serializers.CharField(source='profile_photo', allow_blank=True, required=False)

    class Meta:
        model = Student
        fields = ['name', 'phone', 'email', 'course', 'profilePhoto']


class AttendanceCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating attendance records"""
    class Meta:
        model = AttendanceRecord
        fields = ['date', 'present', 'topic']


class AssignmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating assignments"""
    assignedDate = serializers.DateField(source='assigned_date')
    completedDate = serializers.DateField(source='completed_date', allow_null=True, required=False)

    class Meta:
        model = Assignment
        fields = ['title', 'completed', 'assignedDate', 'completedDate']
