from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("login", views.login_view, name="login"),
    path("user/<str:username>", views.userpage, name="userpage"),
    path("create_player", views.create_player),
    path("update_skill", views.update_skill),
    path("get_story_status", views.get_story_status),
    path("save_story_status", views.save_story_status),
    path("get_all_items", views.get_all_items),
    path("get_story", views.get_story),
    path("change_equipment", views.change_equipment),
    path("buy_item", views.buy_item),
    path("unequip", views.unequip),
    path("faq", views.faq, name="faq"),
    path("get_book", views.book)
]

