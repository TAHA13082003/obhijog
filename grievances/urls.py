from django.urls import path
from .views import (
    DepartmentListView, SubmitGrievanceView,
    MyGrievancesView, TrackGrievanceView,
    AdminGrievanceListView, UpdateGrievanceStatusView,
    AdminDashboardStatsView
)

urlpatterns = [
    path('departments/', DepartmentListView.as_view(), name='departments'),
    path('submit/', SubmitGrievanceView.as_view(), name='submit'),
    path('my/', MyGrievancesView.as_view(), name='my-grievances'),
    path('track/<uuid:tracking_id>/', TrackGrievanceView.as_view(), name='track'),
    path('admin/all/', AdminGrievanceListView.as_view(), name='admin-list'),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('admin/update/<int:pk>/', UpdateGrievanceStatusView.as_view(), name='update-status'),
]