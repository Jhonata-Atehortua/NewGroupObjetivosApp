from django import forms
from django.contrib.auth.forms import AuthenticationForm

class FormularioLogin(AuthenticationForm):
    username = forms.CharField(
        label="Usuario",
        max_length=70,
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control'})  
    )
    password = forms.CharField(
        label="Contraseña",
        max_length=70,
        required=True,
        widget=forms.PasswordInput(attrs={'class': 'form-control'})  
    )