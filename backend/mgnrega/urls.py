from django.urls import path
from . import views

urlpatterns = [
    # Existing routes
    path('districts/', views.DistrictViewSet.as_view({'get': 'list'}), name='district-list'),
    path('districts/<int:pk>/', views.DistrictViewSet.as_view({'get': 'retrieve'}), name='district-detail'),
    path('metrics/', views.MetricViewSet.as_view({'get': 'list'}), name='metric-list'),
    path('districts/<int:pk>/metrics/', views.district_metrics, name='district_metrics'),
]
