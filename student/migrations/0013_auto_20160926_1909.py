# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-26 19:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0012_auto_20160909_1425'),
    ]

    operations = [
        migrations.CreateModel(
            name='Homeroom',
            fields=[
                ('hr_id', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('hr_name', models.CharField(max_length=40)),
                ('teacher_id', models.CharField(max_length=2)),
            ],
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('teacher_id', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('teacher_email', models.CharField(max_length=100)),
                ('teacher_first_name', models.CharField(max_length=80)),
                ('teacher_last_name', models.CharField(max_length=80)),
            ],
        ),
        migrations.AddField(
            model_name='subject',
            name='display_name',
            field=models.CharField(max_length=60, null=True),
        ),
        migrations.AlterField(
            model_name='subject',
            name='image',
            field=models.ImageField(upload_to='images/subj_icons', verbose_name='Subject Icon'),
        ),
    ]
