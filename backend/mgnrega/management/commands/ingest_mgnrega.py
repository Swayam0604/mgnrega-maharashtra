from django.core.management.base import BaseCommand
from django.utils.timezone import now
from mgnrega.models import District, MonthlyMetric, RawSnapshot
from datetime import datetime

class Command(BaseCommand):
    help = "Ingest MGNREGA data for Maharashtra from MIS pages"

    def handle(self, *args, **options):
        """
        Fetches Maharashtra district MGNREGA data.
        For demo, we'll add sample data for the last 6 months.
        """
        try:
            # Get all districts
            districts = District.objects.filter(state_code="18")
            
            if not districts.exists():
                self.stdout.write(self.style.ERROR("No districts found. Run seed_districts first."))
                return

            # Sample MGNREGA data for demonstration
            current_year = 2025
            current_month = 10  # October 2025

            for district in districts:
                for month_offset in range(6):
                    month = current_month - month_offset
                    year = current_year
                    
                    if month <= 0:
                        month += 12
                        year -= 1
                    
                    # Sample data (in real scenario, parse from MIS pages)
                    persondays = 50000 + (district.id * 1000) + (month * 500)
                    households = 1000 + (district.id * 50) + (month * 20)
                    wages = persondays * 200  # ₹200 per personday
                    women_pct = 30 + (month % 10)
                    sc_pct = 15 + (month % 5)
                    st_pct = 10 + (month % 3)
                    pending = 5000 + (month * 100)

                    # Store or update metric
                    MonthlyMetric.objects.update_or_create(
                        district=district,
                        year=year,
                        month=month,
                        defaults={
                            "persondays": persondays,
                            "households_worked": households,
                            "wages_disbursed": wages,
                            "women_pd_pct": women_pct,
                            "sc_pd_pct": sc_pct,
                            "st_pd_pct": st_pct,
                            "pending_payments": pending,
                        }
                    )
                
                self.stdout.write(f"Ingested {district.name}")

            # Store snapshot
            RawSnapshot.objects.create(
                source_url="https://nregastrep.nic.in (demo)",
                html_or_json=f"Ingested at {now()}"
            )

            self.stdout.write(self.style.SUCCESS("Ingestion complete"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Ingestion failed: {str(e)}"))
