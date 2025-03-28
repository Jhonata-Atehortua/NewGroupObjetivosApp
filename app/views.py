from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.contrib.auth import logout
from . import forms

def Inicio(request):
    return render(request,'PaginaPrincipal.html')

def Login(request):
    if request.method == "POST":
        form = forms.FormularioLogin(request,request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request,username = username, password=password)
            if user is not None:
                login(request,user)
                return redirect('Inicio')
    form = forms.FormularioLogin()
    return render(request,'autentication/login.html',{'formL':form})

@login_required
def Logout(request):
    logout(request)
    return redirect('Inicio')