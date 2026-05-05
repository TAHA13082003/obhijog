from django.db import models
from accounts.models import User
import uuid

class Department(models.Model):
    name = models.CharField(max_length=100)
    head_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.name

class Grievance(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
    )
    CATEGORY_CHOICES = (
        ('result', 'Result Issue'),
        ('harassment', 'Harassment'),
        ('facility', 'Facility Problem'),
        ('administrative', 'Administrative'),
        ('other', 'Other'),
    )
    URGENCY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    tracking_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_anonymous = models.BooleanField(default=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='medium')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tracking_id} - {self.title}"

class GrievanceUpdate(models.Model):
    grievance = models.ForeignKey(Grievance, on_delete=models.CASCADE, related_name='updates')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    message = models.TextField()
    status_changed_to = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Update on {self.grievance.tracking_id}"