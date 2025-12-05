"""
API Views for Student management
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Student, AttendanceRecord, Assignment
from .serializers import (
    StudentSerializer, 
    StudentCreateSerializer,
    AttendanceRecordSerializer,
    AttendanceCreateSerializer,
    AssignmentSerializer,
    AssignmentCreateSerializer
)


class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Student CRUD operations
    
    Endpoints:
    - GET /api/students/ - List all students
    - POST /api/students/ - Create new student
    - GET /api/students/{id}/ - Get single student
    - PUT /api/students/{id}/ - Update student
    - DELETE /api/students/{id}/ - Delete student
    - POST /api/students/{id}/attendance/ - Add attendance
    - POST /api/students/{id}/assignments/ - Add assignment
    - PUT /api/students/{id}/assignments/{assignment_id}/toggle/ - Toggle assignment
    - DELETE /api/students/{id}/assignments/{assignment_id}/ - Delete assignment
    """
    queryset = Student.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StudentCreateSerializer
        return StudentSerializer

    @action(detail=True, methods=['post'])
    def attendance(self, request, pk=None):
        """Add attendance record for a student"""
        student = self.get_object()
        serializer = AttendanceCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Update or create attendance for the date
            attendance, created = AttendanceRecord.objects.update_or_create(
                student=student,
                date=serializer.validated_data['date'],
                defaults={
                    'present': serializer.validated_data['present'],
                    'topic': serializer.validated_data.get('topic', '')
                }
            )
            return Response(
                AttendanceRecordSerializer(attendance).data,
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='assignments')
    def add_assignment(self, request, pk=None):
        """Add assignment for a student"""
        student = self.get_object()
        serializer = AssignmentCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            assignment = Assignment.objects.create(
                student=student,
                **serializer.validated_data
            )
            return Response(
                AssignmentSerializer(assignment).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'], url_path='assignments/(?P<assignment_id>[^/.]+)/toggle')
    def toggle_assignment(self, request, pk=None, assignment_id=None):
        """Toggle assignment completion status"""
        student = self.get_object()
        assignment = get_object_or_404(Assignment, id=assignment_id, student=student)
        
        assignment.completed = not assignment.completed
        if assignment.completed:
            from datetime import date
            assignment.completed_date = date.today()
        else:
            assignment.completed_date = None
        assignment.save()
        
        return Response(AssignmentSerializer(assignment).data)

    @action(detail=True, methods=['delete'], url_path='assignments/(?P<assignment_id>[^/.]+)')
    def delete_assignment(self, request, pk=None, assignment_id=None):
        """Delete an assignment"""
        student = self.get_object()
        assignment = get_object_or_404(Assignment, id=assignment_id, student=student)
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
