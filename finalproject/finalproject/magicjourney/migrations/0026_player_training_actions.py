# Generated by Django 3.1.3 on 2020-11-28 22:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('magicjourney', '0025_charm_players'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='training_actions',
            field=models.IntegerField(default=4),
        ),
    ]
