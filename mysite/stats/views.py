from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError, HttpResponseForbidden,HttpResponseNotFound
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

    with open(temp_file) as stats:
        table = stats.readlines()[7:]

    table_list = [row.split() for row in table]

    table_dict = dict((z[0],list(z[1:])) for z in table_list[1:])

    l = []

    keys = [x.lower() for x in table_list[0][1:]]

    for key, value in table_dict.iteritems():
        update_fields = dict(zip(keys, [convert_to_float(i) for i in value]))
        year = int(key)
        if Data.objects.filter(data_type=data_type, country=country, year=year).exists():
            l.append(update_fields)
            Data.objects.filter(data_type=data_type, country=country, year=year).update(**update_fields)
        else:
            insert_fields = dict(data_type=data_type, country=country, year=year)
            insert_fields.update(update_fields)
            Data(**insert_fields).save()
            l.append("not has")

    os.remove(temp_file)

    return HttpResponse(json.dumps(l), content_type="application/json")

def convert_to_float(n):
    try:
        return float(n)
    except ValueError:
        return 0

def resync_data(request, data_type, country):
    res = {"success":True}
    if request.method == 'POST':
        try:

            temp_file = 'temp.txt'
            data_type = data_type
            country = country

            r = requests.get(settings.DATA_ROOT_URL + settings.REGION_TYPE[country][data_type])
            file = open(temp_file,'w')
            file.write(r.text)
            file.close()

            with open(temp_file) as stats:
                table = stats.readlines()[7:]

            table_list = [row.split() for row in table]

            table_dict = dict((z[0],list(z[1:])) for z in table_list[1:])

            l = []

            for key, value in table_dict.iteritems():
                update_fields = dict(zip(table_list[0][1:], value))
                year = int(key)
                if Data.objects.filter(data_type=data_type, country=country, year=year).exists():
                    l.append(update_fields)
                    Data.objects.filter(data_type=data_type, country=country, year=year).update(field1='some value')
                else:
                    l.append("not has")

            os.remove(temp_file)

            return HttpResponse(json.dumps(res), content_type='application/json')
        except Exception, ex:
            res["success"]=False
            res["message"] = ex
            return HttpResponseServerError(json.dumps(res),content_type='application/json')
    res["success"]=False
    return HttpResponse(json.dumps(res), content_type='application/json')
