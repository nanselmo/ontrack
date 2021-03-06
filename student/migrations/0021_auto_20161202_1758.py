# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-12-02 17:58
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django_google_maps.fields


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0020_grade_quarter_grade'),
    ]

    operations = [
        migrations.CreateModel(
            name='HighSchool',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('school_name', models.ImageField(upload_to='images/subj_icons', verbose_name='Subject Icon')),
                ('short_name', models.CharField(max_length=200, null=True)),
                ('website', models.CharField(max_length=500, null=True)),
                ('logo', models.ImageField(upload_to='images/hs_icons', verbose_name='Subject Icon')),
                ('school_type', models.CharField(max_length=50, null=True)),
                ('admit_points', models.IntegerField(null=True)),
                ('address', django_google_maps.fields.AddressField(max_length=200, null=True)),
                ('geolocation', django_google_maps.fields.GeoLocationField(max_length=100, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='testscore',
            name='student',
            field=models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.CASCADE, to='student.Student'),
        ),
    ]
