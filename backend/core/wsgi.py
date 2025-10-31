"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
application = get_wsgi_application()


# New lines added 
# AUTO-RUN SEEDING SCRIPTS ON BOOT (remove after first run!)
try:
    from django.core.management import call_command
    call_command('seed_districts')
    call_command('ingest_mgnrega')
except Exception as e:
    print(f'Data seeding failed: {e}')