from django.urls import path, include
from . import views

urlpatterns = [
    path('',views.InterfazAdministrador,name='InicioAdministrador'),
    path('Capacitaciones',views.ControlCapacitaciones,name="CapacitacionesAdministrador"),
    path('Capacitaciones/ListadoCapacitacionesBlandas',views.ListadoCapacitacionesBlandas),
    path('Capacitaciones/ListadoCapacitacionesTecnicas',views.ListadoCapacitacionesTecnicas),
    path('Capacitaciones/CategoriasCapacitaciones',views.ListadoCategorias),
    path('Capacitaciones/ElimininarCapacitacion/<int:idC>',views.EliminarCapacitacion),
    path('Capacitaciones/ActualizarCapacitacion/<int:idC>',views.ActualizarCapacitacion),
    path('Capacitaciones/AgregarCapacitacionBlanda',views.AgregarCapacitacionBlanda,name="AgregarCapacitacionBlanda"),
    path('Capacitaciones/AgregarCapacitacionTecnica',views.AgregarCapacitacionTecnica,name="AgregarCapacitacionTecnica"),
    path('Capacitaciones/EstructuraMigrar',views.EstructuraMigrarCapacitaciones,name="EstructuraMigrar"),
    path('Capacitaciones/MigrarArchivoCB',views.MigracionCapacionesBlandas,name="MigrarArchivoCB"),
    path('Capacitaciones/MigrarArchivoCT',views.MigracionCapacionesTecnicas,name="MigrarArchivoCT")
]
