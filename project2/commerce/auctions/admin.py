from django.contrib import admin

from .models import User, Auction, Bid, Comment

class UserAdmin (admin.ModelAdmin):
    list_display = ("id", "username")

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Auction)
admin.site.register(Bid)
admin.site.register(Comment)