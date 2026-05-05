from django.contrib import admin
from .models import Department, Grievance, GrievanceUpdate

admin.site.register(Department)
admin.site.register(Grievance)
admin.site.register(GrievanceUpdate)