from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse
from . import models
import os

# Create your views here.
@login_required
def EstructuraCapacitaciones(request):
    return render(request,'capacitaciones.html')

@login_required
def ListadoCapacitacionesBlandas(request):
    user = request.user
    result = list(models.Registro.ListadoC(user=user))
    return JsonResponse(result, safe=False)

@login_required
def TerminarCapacitacion(request,idR):
    if request.method == 'POST':
        infoR = models.Registro.InformacionRegistro(idR)
        archivo = request.FILES['archivo']
        extencion = os.path.splitext(archivo.name)[1]
        nombreArchivo = f"R{infoR.id}_CAP{infoR.idCapacitacion.id}_USER{infoR.idUsuario.username}{extencion}"
        ruta = os.path.join(r'C:\Users\Jhonatan\OneDrive\PROGRAMACION\NG\Objetivos\Archivos\Capacitaciones', nombreArchivo)
        os.makedirs(os.path.dirname(ruta),exist_ok=True)
        with open(ruta,'wb') as file:
            for chunk in archivo.chunks():
                file.write(chunk) 
        try:
            result = models.Registro.TerminarRegistro(idR,nombreArchivo)
            return redirect('InicioCapacitaciones')
        except Exception as e:
            return HttpResponse(f"Error al procesar el CSV: {str(e)}", status=400)
        
    return redirect('InicioCapacitaciones') 
