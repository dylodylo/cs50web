# Generated by Django 3.1.2 on 2020-10-14 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0008_auto_20201014_1119'),
    ]

    operations = [
        migrations.AddField(
            model_name='auction',
            name='image',
            field=models.ImageField(default='default.jpg', upload_to=''),
        ),
    ]