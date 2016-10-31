
#import all normal settings
from .settings import *

#change some of the setting for production
DEBUG = False

#allauth production site (pythonanywhere.com)
SITE_ID = 1

if os.environ.get('DEVELOPMENT', None):
    from settings_dev import *

    
