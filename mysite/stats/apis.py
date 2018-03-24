from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError, HttpResponseForbidden,HttpResponseNotFound
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.template import RequestContext, loader, Template
from stats.models import *
from django.core.serializers.json import DjangoJSONEncoder

import requests
import json
import os

@csrf_exempt
def resync_data(request):
    res = {"success":True}
    if request.method == 'POST':
        try:

            temp_file = 'temp.txt'
            data_type = request.POST.get('data_type')
            region = request.POST.get('region')

            r = requests.get(settings.DATA_ROOT_URL + settings.REGION_TYPE[region][data_type])
            file = open(temp_file,'w')
            file.write(r.text)
            file.close()

            with open(temp_file) as stats:
                table = stats.readlines()[7:]

            table_list = [row.split() for row in table]

            table_dict = dict((z[0],list(z[1:])) for z in table_list[1:])

            keys = [x.lower() for x in table_list[0][1:]]

            for key, value in table_dict.iteritems():
                update_fields = dict(zip(keys, [convert_to_float(i) for i in value]))
                year = int(key)
                if Data.objects.filter(data_type=data_type, country=region, year=year).exists():
                    Data.objects.filter(data_type=data_type, country=region, year=year).update(**update_fields)
                else:
                    insert_fields = dict(data_type=data_type, country=region, year=year)
                    insert_fields.update(update_fields)
                    Data(**insert_fields).save()

            os.remove(temp_file)

            d = Data.objects.values().filter(data_type=data_type, country=region)
            data = json.dumps(list(d), cls=DjangoJSONEncoder)

            res["stats"] = data

            return HttpResponse(json.dumps(res), content_type='application/json')
        except Exception, ex:
            res["success"]=False
            res["message"] = ex
            return HttpResponseServerError(json.dumps(res),content_type='application/json')
    res["success"]=False
    return HttpResponse(json.dumps(res), content_type='application/json')

# Helper function
def convert_to_float(n):
    try:
        return float(n)
    except ValueError:
        return 0
