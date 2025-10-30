from rest_framework import serializers
from .models import District, MonthlyMetric, RawSnapshot

class DistrictSerializers(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name', 'state_code', 'centroid_lat', 'centroid_lng']


class MonthlyMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyMetric
        fields = [
            'id', 'district', 'year', 'month', 'persondays', 
            'households_worked', 'wages_disbursed', 'women_pd_pct', 
            'sc_pd_pct', 'st_pd_pct', 'pending_payments', 'last_updated_at'
        ]

class RawSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawSnapshot
        fields = ['id', 'source_url', 'snapshot_date', 'created_at']
