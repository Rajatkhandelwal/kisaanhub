# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('data_type', models.CharField(max_length=200)),
                ('year', models.IntegerField(default=0)),
                ('jan', models.FloatField(default=0)),
                ('feb', models.FloatField(default=0)),
                ('mar', models.FloatField(default=0)),
                ('apr', models.FloatField(default=0)),
                ('may', models.FloatField(default=0)),
                ('jun', models.FloatField(default=0)),
                ('jul', models.FloatField(default=0)),
                ('aug', models.FloatField(default=0)),
                ('sep', models.FloatField(default=0)),
                ('oct', models.FloatField(default=0)),
                ('nov', models.FloatField(default=0)),
                ('dec', models.FloatField(default=0)),
                ('win', models.FloatField(default=0)),
                ('spr', models.FloatField(default=0)),
                ('sum', models.FloatField(default=0)),
                ('aut', models.FloatField(default=0)),
                ('ann', models.FloatField(default=0)),
            ],
        ),
    ]
