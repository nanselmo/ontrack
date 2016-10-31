from .settings import *

DEBUG = True

TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'dev-db.sqlite3'),
    }
}

#development (localhost:8000)
SITE_ID = 2
