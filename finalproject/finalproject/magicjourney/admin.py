from django.contrib import admin
from .models import User, Player, Wand, Robe, Charm, Book
# Register your models here.

admin.site.register(User)
admin.site.register(Player)
admin.site.register(Wand)
admin.site.register(Robe)
admin.site.register(Charm)
admin.site.register(Book)