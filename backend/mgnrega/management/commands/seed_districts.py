from django.core.management.base import BaseCommand
from mgnrega.models import District


DISTRICTS_WITH_NAMES = [
    {"en": "Ahmednagar", "hi": "[translate:अहमदनगर]", "mr": "[translate:अहमदनगर]"},
    {"en": "Akola", "hi": "[translate:अकोला]", "mr": "[translate:अकोला]"},
    {"en": "Amravati", "hi": "[translate:अमरावती]", "mr": "[translate:अमरावती]"},
    {"en": "Aurangabad", "hi": "[translate:औरंगाबाद]", "mr": "[translate:औरंगाबाद]"},
    {"en": "Beed", "hi": "[translate:बीड]", "mr": "[translate:बीड]"},
    {"en": "Bhandara", "hi": "[translate:भंडारा]", "mr": "[translate:भंडारा]"},
    {"en": "Buldhana", "hi": "[translate:बुलढाणा]", "mr": "[translate:बुलढाणा]"},
    {"en": "Chandrapur", "hi": "[translate:चंद्रपूर]", "mr": "[translate:चंद्रपूर]"},
    {"en": "Dhule", "hi": "[translate:धुळे]", "mr": "[translate:धुळे]"},
    {"en": "Gadchiroli", "hi": "[translate:गडचिरोली]", "mr": "[translate:गडचिरोली]"},
    {"en": "Gondia", "hi": "[translate:गोंदिया]", "mr": "[translate:गोंदिया]"},
    {"en": "Hingoli", "hi": "[translate:हिंगोली]", "mr": "[translate:हिंगोली]"},
    {"en": "Jalgaon", "hi": "[translate:जळगाव]", "mr": "[translate:जळगाव]"},
    {"en": "Jalna", "hi": "[translate:जालना]", "mr": "[translate:जालना]"},
    {"en": "Kolhapur", "hi": "[translate:कोल्हापूर]", "mr": "[translate:कोल्हापूर]"},
    {"en": "Latur", "hi": "[translate:लातूर]", "mr": "[translate:लातूर]"},
    {"en": "Mumbai City", "hi": "[translate:मुंबई शहर]", "mr": "[translate:मुंबई शहर]"},
    {"en": "Mumbai Suburban", "hi": "[translate:मुंबई उपनगर]", "mr": "[translate:मुंबई उपनगर]"},
    {"en": "Nagpur", "hi": "[translate:नागपूर]", "mr": "[translate:नागपूर]"},
    {"en": "Nanded", "hi": "[translate:नांदेड]", "mr": "[translate:नांदेड]"},
    {"en": "Nashik", "hi": "[translate:नाशिक]", "mr": "[translate:नाशिक]"},
    {"en": "Navi Mumbai", "hi": "[translate:नवी मुंबई]", "mr": "[translate:नवी मुंबई]"},
    {"en": "Osmnagaraged", "hi": "[translate:ओसमनगर]", "mr": "[translate:ओसमनगर]"},
    {"en": "Parbhani", "hi": "[translate:परभणी]", "mr": "[translate:परभणी]"},
    {"en": "Pune", "hi": "[translate:पुणे]", "mr": "[translate:पुणे]"},
    {"en": "Raigad", "hi": "[translate:रायगड]", "mr": "[translate:रायगड]"},
    {"en": "Ratnagiri", "hi": "[translate:रत्नागिरी]", "mr": "[translate:रत्नागिरी]"},
    {"en": "Sangli", "hi": "[translate:सांगली]", "mr": "[translate:सांगली]"},
    {"en": "Satara", "hi": "[translate:सातारा]", "mr": "[translate:सातारा]"},
    {"en": "Solapur", "hi": "[translate:सोलापूर]", "mr": "[translate:सोलापूर]"},
    {"en": "Thane", "hi": "[translate:ठाणे]", "mr": "[translate:ठाणे]"},
    {"en": "Wardha", "hi": "[translate:वर्धा]", "mr": "[translate:वर्धा]"},
    {"en": "Washim", "hi": "[translate:वाशीम]", "mr": "[translate:वाशीम]"},
    {"en": "Yavatmal", "hi": "[translate:यवतमाल]", "mr": "[translate:यवतमाल]"},
]


class Command(BaseCommand):
    help = "Seed Maharashtra districts with language translations"

    def handle(self, *args, **options):
        for d in DISTRICTS_WITH_NAMES:
            District.objects.get_or_create(
                name_en=d["en"],
                name_hi=d["hi"],
                name_mr=d["mr"],
                state_code="18"
            )
        self.stdout.write(self.style.SUCCESS("Districts seeded with translations"))
