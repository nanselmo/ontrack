# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-06-01 21:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0041_nweapercentileconversion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nweapercentileconversion',
            name='percentile',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='nweapercentileconversion',
            name='rit',
            field=models.IntegerField(null=True),
        ),
    ]
