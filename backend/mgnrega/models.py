from django.db import models

# Create your models here.

class District(models.Model):
    name = models.CharField(max_length=100, unique=True)
    state_code = models.CharField(max_length=10, default='18') # 18 IS FOR MAHARASHTRA
    centroid_lat = models.FloatField(null=True, blank=True)
    centroid_lng = models.FloatField(null=True, blank =True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class MonthlyMetric(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='metrics')
    year = models.IntegerField()
    month = models.IntegerField()
    persondays = models.BigIntegerField(null=True, blank=True)
    households_worked = models.BigIntegerField(null=True, blank=True)
    wages_disbursed = models.BigIntegerField(null=True, blank=True)  # IN RUPEES
    women_pd_pct = models.FloatField(null=True, blank=True) # PERCENTAGE
    sc_pd_pct = models.FloatField(null=True, blank=True) # PERCENTAGE
    st_pd_pct = models.FloatField(null=True, blank=True) # PERCENTAGE
    pending_payments = models.BigIntegerField(null=True, blank=True) # IN RUPEES
    last_updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.district.name} - {self.year}-{self.month:02d}"
    
    class Meta:
        unique_together = ('district', 'year', 'month')
        ordering = ['-year', '-month']


class RawSnapshot(models.Model):
    source_url = models.URLField()
    snapshot_data = models.DateTimeField(auto_now_add=True)
    html_or_json = models.TextField()   #  RAW DATA FROM API/SCRAPE
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source_url} - {self.snapshot_data}"
    
    class Meta:
        ordering = ['-created_at']
        
