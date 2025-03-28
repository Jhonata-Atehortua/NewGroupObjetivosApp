from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from . import models

# Create your views here.
@login_required
def EstructuraCapacitaciones(request):
    return render(request,'capacitaciones.html')

@login_required
def ListadoCapacitacionesBlandas(request):
    user = request.user
    result = list(models.Registro.ListadoC(user=user))
    return JsonResponse(result, safe=False)
