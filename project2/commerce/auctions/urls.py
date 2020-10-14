from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("auction/<int:auction_id>", views.auction, name="auction"),
    path("new", views.new, name="new"),
    path("watchlist/<int:user_id>", views.watchlist, name="watchlist"),
    path("close/<int:auction_id>", views.end_auction, name="close"),
    path("add/<int:auction_id>", views.add, name="add"),
    path("delete/<int:auction_id>", views.delete, name="delete"),
    path("categories", views.categories, name="categories"),
    path("category/<str:category_name>", views.category, name="category")
] 
