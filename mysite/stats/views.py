from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from stats.models import *

import json

# Create your views here.
def index(request):
    with open(settings.STATIC_ROOT + "/stats/uk_max_temp.txt") as f:
        lines_after_7 = f.readlines()[7:]

    arr = [line.split() for line in lines_after_7]

    dicts = dict((z[0],list(z[1:])) for z in arr[1:])

    l = []

    for key, value in dicts.iteritems():
        k = int(key)
        if Data.objects.filter(year=k).exists():
            l.append("has")

#        if created:
#           # means you have created a new person
#        else:
#           # stat just refers to the existing one

    return HttpResponse(json.dumps(l), content_type="application/json")
