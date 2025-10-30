from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg 
from .models import District, MonthlyMetric, RawSnapshot
from .serializers import DistrictSerializers, MonthlyMetricSerializer, RawSnapshotSerializer

# Create your views here.

class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializers

    @action(detail=True, methods=['get'])
    def summary(self, request, pk= None):
        """GET LATEST MONTH SUMMARY WITH DELTA FROM PREVIOUS MONTH"""
        district = self.get_object()
        latest = district.metric.order_by('-year','month').first()

        if not latest:
            return Response({"error": "No Data"}, status= status.HTTP_404_NOT_FOUND)

        previous = district.metrics.filter(
            year__lt=latest.year if latest.month == 1 else latest.year,
            month__lt=latest.month if latest.month > 1 else 12
        ).order_by('-year', '-month').first()
        
        if latest.month == 1:
            prev_year = latest.year - 1
            previous = district.metrics.filter(year=prev_year, month=12).first()
        else:
            previous = district.metrics.filter(year=latest.year, month=latest.month - 1).first()
        
        delta = {}
        if previous:
            delta_persondays = (latest.persondays or 0) - (previous.persondays or 0)
            delta['persondays_change'] = delta_persondays
            delta['persondays_pct_change'] = (delta_persondays / (previous.persondays or 1)) * 100 if previous.persondays else 0
            delta['wages_change'] = (latest.wages_disbursed or 0) - (previous.wages_disbursed or 0)

        return Response({
            "district": district.name,
            "latest": MonthlyMetricSerializer(latest).data,
            "delta": delta,
            "previous": MonthlyMetricSerializer(previous).data if previous else None,
        })

    @action(detail=True, methods=['get'])
    def timeseries(self, request, pk=None):
        """GET LAST N MONTHS OF METRICS FOR CHARTS"""
        district = self.get_object()
        months = int(request.query_params.get('months', 6))
        metrics = district.metrics.order_by('-year', '-month')[:months]
        return Response({
            "district": district.name,
            "data": MonthlyMetricSerializer(metrics, many=True).data,
        })
    

class MetricViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MonthlyMetric.objects.all()
    serializer_class = MonthlyMetricSerializer

    @action(detail=False, methods=['get'])
    def compare(self, request):
        """Compare district metric with state average"""
        district_id = request.query_params.get('district_id')
        metric = request.query_params.get('metric', 'persondays')
        
        if not district_id:
            return Response({"error": "district_id required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            district = District.objects.get(id=district_id)
        except District.DoesNotExist:
            return Response({"error": "District not found"}, status=status.HTTP_404_NOT_FOUND)

        latest_month = MonthlyMetric.objects.order_by('-year', '-month').values('year', 'month').first()
        if not latest_month:
            return Response({"error": "No data"}, status=status.HTTP_404_NOT_FOUND)

        district_metric = MonthlyMetric.objects.filter(
            district=district,
            year=latest_month['year'],
            month=latest_month['month']
        ).first()

        state_avg = MonthlyMetric.objects.filter(
            year=latest_month['year'],
            month=latest_month['month']
        ).aggregate(avg=Avg(metric))

        return Response({
            "district_name": district.name,
            "district_value": getattr(district_metric, metric, None) if district_metric else None,
            "state_average": state_avg['avg'],
            "metric": metric,
        })

