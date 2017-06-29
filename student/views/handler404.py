from django.shortcuts import render_to_response
from django.template import RequestContext 

def handler404(reqest):
    response = render_to_response("student/404.html", {}, context_instance=RequestContext(request))
    return response
