from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('role', 'student_id', 'department', 'phone')}),
    )

admin.site.register(User, CustomUserAdmin)