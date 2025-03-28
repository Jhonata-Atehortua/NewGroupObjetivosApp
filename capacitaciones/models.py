from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class CategoriaCapacitacion(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(unique=True,null=False,max_length=50)

    @classmethod
    def ListadoCategorias(cls):
        Query = cls.objects.all()
        return Query

class Capacitacion(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100,null=False)
    descripcion = models.TextField(null=False)
    url = models.TextField(null=True)
    fechaInicio = models.DateField(null=False)
    fechaFin = models.DateField(null=False)
    idCategoria = models.ForeignKey(
        CategoriaCapacitacion,
        on_delete=models.RESTRICT,
        related_name="capacitaciones"
    )
    estado = models.BooleanField(
        default=True
    )

    @classmethod
    def ListadoCB(cls):
        try:
            QueryTC = CategoriaCapacitacion.objects.get(nombre="BLANDAS")
            QueryC = cls.objects.filter(idCategoria=QueryTC)
            return QueryC
        except CategoriaCapacitacion.DoesNotExist:
            return cls.objects.none()

    @classmethod
    def ListadoCT(cls):
        try:
            QueryTC = CategoriaCapacitacion.objects.get(nombre="TECNICAS")
            QueryC = cls.objects.filter(idCategoria=QueryTC)
            return QueryC
        except CategoriaCapacitacion.DoesNotExist:
            return cls.objects.none()
        
    @classmethod
    def AgregarCB(cls,datos):
        try:
            Query = cls(
                nombre=datos['nombre'],
                descripcion=datos['descripcion'],
                url = None,
                fechaInicio=datos['fechaInicio'],
                fechaFin=datos['fechaFin'],
                idCategoria = CategoriaCapacitacion.objects.get(nombre="BLANDAS")
            )
            Query.save()
            return {'status':'success','message':'Capacitacion Agregada','idC':Query.id}
        
        except KeyError as Ke:
            return {'status':'error','message':f'Falta el campo {str(Ke)}'}
        
        except CategoriaCapacitacion.DoesNotExist:
            return {'status':'error','message':f'No existe la categoria BLANDAS en la base de datos'}
        
        except Exception as E:
            return {'status':'error','message':f'Error inesperado {str(E)}'}
    
    @classmethod
    def AgregarCT(cls,datos):
        try:
            Query = cls(
                nombre=datos['nombre'],
                descripcion=datos['descripcion'],
                url = datos['urlACT'],
                fechaInicio=datos['fechaInicio'],
                fechaFin=datos['fechaFin'],
                idCategoria = CategoriaCapacitacion.objects.get(nombre="TECNICAS")
            )
            Query.save()
            return {'status':'success','message':'Capacitacion Agregada','idC':Query.id}
        
        except KeyError as Ke:
            return {'status':'error','message':f'Falta el campo {str(Ke)}'}
        
        except CategoriaCapacitacion.DoesNotExist:
            return {'status':'error','message':f'No existe la categoria TECNICAS en la base de datos'}
        
        except Exception as E:
            return {'status':'error','message':f'Error inesperado {str(E)}'}
        
    @classmethod
    def EliminarCapacitacion(cls,idC):
        try:
            Query = cls.objects.get(id=idC).delete()
            return {'status':'susccess','message':'Se elimino la capacitacion'}
        except CategoriaCapacitacion.DoesNotExist:  
            return {'status':'error','message':'No se encontro la capacitacion a eliminar'}
        
    @classmethod
    def ActualizarCapacitacion(cls,idC,datos):
        try:
            capa = cls.objects.get(id=idC)
            capa.nombre = datos['nombre']
            capa.descripcion = datos['descripcion']
            capa.url = datos['url']
            capa.fechaInicio = datos['fechaInicio']
            capa.fechaFin = datos['fechaFin']
            capa.idCategoria = CategoriaCapacitacion.objects.get(id=datos['idCategoria'])

            capa.save()

            return {'status':'susccess','message':'Se actualizo la capacitacion'}
        
        except Capacitacion.DoesNotExist:
            return {'status':'error','message':'No se encontro la capacitacion a eliminar'}
        
class Registro(models.Model):
    id = models.AutoField(primary_key=True)
    idUsuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registros')
    idCapacitacion = models.ForeignKey(Capacitacion, on_delete=models.CASCADE, related_name='registros')
    fechaRegistro = models.DateField(auto_now_add=True)
    estado = models.BooleanField(default=True)
    evidencia = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ('idUsuario', 'idCapacitacion')

    def __str__(self):
        return f'{self.idUsuario.username} - {self.idCapacitacion.nombre}'
    
    @classmethod
    def ListadoC(cls,user):
        try:
            QueryC = cls.objects.select_related('idCapacitacion').filter(idUsuario=user)
            Result = [
                {
                    'id_registro' : registro.idCapacitacion.descripcion,
                    'id' : registro.idCapacitacion.id,
                    'nombre' : registro.idCapacitacion.nombre,
                    'descripcion' : registro.idCapacitacion.descripcion,
                    'fechaInicio' : registro.idCapacitacion.fechaInicio,
                    'fechaFin' : registro.idCapacitacion.fechaFin,
                    'idCategoria' : registro.idCapacitacion.idCategoria.nombre,
                    'url' : registro.idCapacitacion.url
                }

                for registro in QueryC
            ]
            return Result
        
        except Registro.DoesNotExist:
            return cls.objects.none()

    @classmethod
    def AgregarRegistro(cls,idC):
        try:
            Capa = Capacitacion.objects.get(id=idC)
            usuarios_no_admin = User.objects.filter(is_staff=False)
            registros = []

            for usuario in usuarios_no_admin:
                registro = cls(idUsuario=usuario,idCapacitacion=Capa)
                registros.append(registro)
            
            cls.objects.bulk_create(registros)

            return registros
        except Registro.DoesNotExist:
            return cls.objects.none()