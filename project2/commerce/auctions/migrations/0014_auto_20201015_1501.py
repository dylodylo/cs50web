# Generated by Django 3.1.2 on 2020-10-15 15:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0013_auto_20201015_1212'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auction',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_auctions', to=settings.AUTH_USER_MODEL),
        ),
    ]
