# Generated by Django 3.1.2 on 2020-10-13 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0002_auction_bid_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='auction',
            name='description',
            field=models.TextField(default='description'),
            preserve_default=False,
        ),
    ]
