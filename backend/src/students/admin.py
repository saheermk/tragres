"""
Admin configuration for Student models
"""
from django.contrib import admin
from .models import Student, AttendanceRecord, Assignment


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'course', 'created_at']
    search_fields = ['name', 'email', 'phone', 'course']
    list_filter = ['course', 'created_at']


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['student', 'date', 'present', 'topic']
    list_filter = ['present', 'date']
    search_fields = ['student__name', 'topic']


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'student', 'completed', 'assigned_date', 'completed_date']
    list_filter = ['completed', 'assigned_date']
    search_fields = ['title', 'student__name']
