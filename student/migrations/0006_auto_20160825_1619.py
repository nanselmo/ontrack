# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-25 16:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0005_auto_20160825_1546'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='absent_days',
            field=models.DecimalField(decimal_places=2, max_digits=4),
        ),
        migrations.AlterField(
            model_name='attendance',
            name='total_days',
            field=models.DecimalField(decimal_places=1, max_digits=4),
        ),
    ]