# Generated by Django 3.1.3 on 2020-11-21 14:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('magicjourney', '0018_auto_20201121_1323'),
    ]

    operations = [
        migrations.AddField(
            model_name='wand',
            name='herbology',
            field=models.IntegerField(default=0),
        ),
    ]
