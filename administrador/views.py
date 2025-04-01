from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from capacitaciones import models
from django.http import HttpResponseForbidden
from django.http import HttpResponse
from datetime import datetime
import json
import csv
import io

# Create your views here.
@login_required
def InterfazAdministrador(request):
    if request.user.is_superuser:
        return render(request,'InicioAdministrador.html')
    
    return HttpResponseForbidden("Acceso denegado: falta de permisos")

@login_required
def ControlCapacitaciones(request):
    if request.user.is_superuser:
        return render(request,'AdminCapacitaciones.html')
    
    return HttpResponseForbidden("Acceso denegado: falta de permisos")    

@login_required
def ListadoCapacitacionesBlandas(request):
    if request.user.is_superuser:
        result = list(models.Capacitacion.ListadoCB().values())
        return JsonResponse(result, safe=False)

@login_required
def ListadoCapacitacionesTecnicas(request):
    if request.user.is_superuser:
        result = list(models.Capacitacion.ListadoCT().values())
        return JsonResponse(result, safe=False)

@login_required
def EliminarCapacitacion(request,idC):
    if request.user.is_superuser:
        if request.method == 'DELETE':
            result = models.Capacitacion.EliminarCapacitacion(idC)
            return JsonResponse(result,safe=False)
        return JsonResponse({'status':'error','message':'Solicitud Incorrecta'})

@login_required
def ActualizarCapacitacion(request,idC):
    if request.user.is_superuser:
        if request.method == 'PUT':
            datosA = json.loads(request.body)
            result = models.Capacitacion.ActualizarCapacitacion(idC,datosA)
            return JsonResponse(result,safe=False)
    
    return JsonResponse({'status':'error','message':'Solicitud Incorrecta'})

@login_required
def ListadoCategorias(request):
    if request.user.is_superuser:
        result = list(models.CategoriaCapacitacion.ListadoCategorias().values())
        return JsonResponse(result, safe=False)

@login_required
def AgregarCapacitacionBlanda(request):
    if request.user.is_superuser:
        if request.method != "POST":
            return JsonResponse({'status':'error','message':'Peticcion no permitida'})
        
        try:
            datos = json.loads(request.body.decode('utf-8'))
            result = models.Capacitacion.AgregarCB(datos)
            try:
                models.Registro.AgregarRegistro(result['idC'])
                return JsonResponse(result,safe=False)
            except Exception as e:
                return JsonResponse({"status": "error", "message": f"Error inesperado: {str(e)}"}, status=500)

        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Error inesperado: {str(e)}"}, status=500)
    
@login_required
def AgregarCapacitacionTecnica(request):
    if request.user.is_superuser:
        if request.method != "POST":
            return JsonResponse({'status':'error','message':'Peticcion no permitida'})
        
        try:
            datos = json.loads(request.body.decode('utf-8'))
            result = models.Capacitacion.AgregarCT(datos)
            try:
                models.Registro.AgregarRegistro(result['idC'])
                return JsonResponse(result,safe=False)
            except Exception as e:
                
                return JsonResponse({"status": "error", "message": f"Error inesperado: {str(e)}"}, status=500)
        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Error inesperado: {str(e)}"}, status=500)
        
@login_required
def EstructuraMigrarCapacitaciones(request):
    if request.user.is_superuser:
        #Creacion estructura migracion masiva Capacitaciones
        respuesta = HttpResponse(content_type='text/csv')
        respuesta['Content-Disposition'] = 'attachment; filename="estructura_migracion.csv"'

        columnas = ['nombre','descripcion','url','fechaInicio','fechaFin']

        escribir = csv.DictWriter(respuesta,fieldnames=columnas)
        escribir.writeheader()
        return respuesta
    
@login_required
def MigracionCapacionesBlandas(request):
    if request.user.is_superuser:
        if request.method == 'POST' and request.FILES.get('archivo'):

            archivo = request.FILES['archivo']
            
            try:
                contenido = archivo.read().decode('utf-8')
                archivo_leido = csv.DictReader(io.StringIO(contenido),delimiter=';')

                for fila in archivo_leido:
                    Registro = {
                        'nombre' : fila.get('nombre'),
                        'descripcion' : fila.get('descripcion',''),
                        'fechaInicio' : datetime.strptime(fila.get('fechaInicio'), "%d/%m/%Y").date(),
                        'fechaFin' : datetime.strptime(fila.get('fechaFin',None), "%d/%m/%Y").date()
                    }
                    try:
                        Result = models.Capacitacion.AgregarCB(Registro)
                        models.Registro.AgregarRegistro(Result['idC'])
                    except models.Capacitacion.DoesNotExist:
                        print('error')
                
                return redirect('CapacitacionesAdministrador') 
            except Exception as e:
                return HttpResponse(f"Error al procesar el CSV: {str(e)}", status=400)

        return redirect('CapacitacionesAdministrador') 

@login_required
def MigracionCapacionesTecnicas(request):
    if request.user.is_superuser:
        if request.method == 'POST' and request.FILES.get('archivo'):

            archivo = request.FILES['archivo']
            
            try:
                contenido = archivo.read().decode('utf-8')
                archivo_leido = csv.DictReader(io.StringIO(contenido),delimiter=';')

                for fila in archivo_leido:
                    Registro = {
                        'nombre' : fila.get('nombre'),
                        'descripcion' : fila.get('descripcion',''),
                        'urlACT' : fila.get('url'),
                        'fechaInicio' : datetime.strptime(fila.get('fechaInicio'), "%d/%m/%Y").date(),
                        'fechaFin' : datetime.strptime(fila.get('fechaFin',None), "%d/%m/%Y").date()
                    }
                    try:
                        Result = models.Capacitacion.AgregarCT(Registro)
                        models.Registro.AgregarRegistro(Result['idC'])
                    except models.Capacitacion.DoesNotExist:
                        print('error')
                
                return redirect('CapacitacionesAdministrador') 
            except Exception as e:
                return HttpResponse(f"Error al procesar el CSV: {str(e)}", status=400)

        return redirect('CapacitacionesAdministrador') 

@login_required
def RegistroCapacitacion(request,idC):
    result = models.User.objects.filter(is_staff=False)
    return render(request,'Registros.html',{'usuarios':result})

@login_required
def ListadoRegistrosCapa(request,idC):
    result = models.Registro.ListadoRegistrosCapa(idC)
    print(result)
    return JsonResponse(result,safe=False)

@login_required
def EliminarRegistroCapa(request,idR):
    if request.method == "DELETE":
        models.Registro.EliminarRegistro(idR)
        return JsonResponse({'Status':"success"},safe=False)
    
@login_required
def AgregarRegistro(request,idC):
    if request.method == "POST":
        datos = json.loads(request.body.decode('utf-8'))
        result = models.Registro.AgregarRegistroManual(idC,datos['usuario'])
        return JsonResponse(result,safe=False)