"""
Student models for Tragres ERP
"""
from django.db import models
import uuid


class Student(models.Model):
    """Student profile model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, default='')
    course = models.CharField(max_length=200)
    profile_photo = models.TextField(blank=True, default='')  # Base64 or URL
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class AttendanceRecord(models.Model):
    """Daily attendance record for a student"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE, 
        related_name='attendance'
    )
    date = models.DateField()
    present = models.BooleanField(default=False)
    topic = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['student', 'date']

    def __str__(self):
        status = 'Present' if self.present else 'Absent'
        return f"{self.student.name} - {self.date} - {status}"


class Assignment(models.Model):
    """Assignment model for tracking student work"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE, 
        related_name='assignments'
    )
    title = models.CharField(max_length=500)
    completed = models.BooleanField(default=False)
    assigned_date = models.DateField()
    completed_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-assigned_date']

    def __str__(self):
        status = '✓' if self.completed else '○'
        return f"{status} {self.title} - {self.student.name}"
