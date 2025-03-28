from django.urls import path
from . import views

urlpatterns = [
    path('',views.EstructuraCapacitaciones,name='InicioCapacitaciones'),
    path('ListadoCapacitaciones',views.ListadoCapacitacionesBlandas)
]
