from django.urls import path,include
from . import views


urlpatterns = [
    #path('',views.show_index_page,name="index"), 
    path('hello_world', views.hello_world),
    path('getData', views.getData),
    path('sign_up', views.sign_up),
    path('log_in', views.log_in),
    #path('dashboard',views.dashboard,name="dashboard"), 
]
