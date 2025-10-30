from django.core.management.base import BaseCommand
from mgnrega.models import District

MAHARASHTRA_DISTRICTS = [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
    "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
    "Nagpur", "Nanded", "Nashik", "Navi Mumbai", "Osmnagaraged", "Parbhani",
    "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Solapur",
    "Thane", "Wardha", "Washim", "Yavatmal"
]

class Command(BaseCommand):
    help = "Seed Maharashtra districts"

    def handle(self, *args, **options):
        for district_name in MAHARASHTRA_DISTRICTS:
            District.objects.get_or_create(name=district_name, state_code="18")
        self.stdout.write(self.style.SUCCESS("Districts seeded"))
