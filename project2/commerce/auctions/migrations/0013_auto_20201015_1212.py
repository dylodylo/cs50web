# Generated by Django 3.1.2 on 2020-10-15 12:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0012_auto_20201014_1509'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=100)),
                ('image', models.ImageField(upload_to='')),
            ],
        ),
        migrations.AlterField(
            model_name='auction',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auctions.category'),
        ),
    ]