from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from stats.models import *

import requests
import json
import os

# Create your views here.
def index(request):

    temp_file = 'temp.txt'
    data_type = 'min_temp'
    country = 'uk'

    r = requests.get(settings.DATA_ROOT_URL + settings.REGION_TYPE[country][data_type])
    file = open(temp_file,'w')
    file.write(r.text)
    file.close()

    with open(temp_file) as f:
        lines_after_7 = f.readlines()[7:]

    arr = [line.split() for line in lines_after_7]

    dicts = dict((z[0],list(z[1:])) for z in arr[1:])

    l = []

    for key, value in dicts.iteritems():
        k = int(key)
        if Data.objects.filter(data_type=data_type, country=country, year=k).exists():
            l.append("has")

    os.remove(temp_file)

    return HttpResponse(json.dumps(l), content_type="application/json")
