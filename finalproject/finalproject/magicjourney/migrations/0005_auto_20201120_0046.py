# Generated by Django 3.1.3 on 2020-11-20 00:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('magicjourney', '0004_player_house'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='blood',
            field=models.CharField(blank=True, choices=[('Muggle', 'Muggle'), ('Half-blood', 'Half-blood'), ('Pure-blood', 'Pure-blood')], max_length=30),
        ),
    ]
