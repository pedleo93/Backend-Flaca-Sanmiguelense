import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-gestor-permisos',
  templateUrl: './gestor-permisos.component.html',
  providers: [MessageService]
})
export class GestorPermisosComponent {

  permisos: any = [];
  permisoDialog: boolean = false;
  permiso: any;
  selectedPermisos: any = [];
  submitted: boolean = false;
  loading = false;
  total = 0;
  visible: boolean = false;
  visibleE: boolean = false;
  visibleDel: boolean = false;
  visibleVar: boolean = false;
  IDd: number = 0;
  disableA: boolean = false;
  disableU: boolean = false;
  disableD: boolean = false;
  disableDV: boolean = false;

  Formulario: FormGroup = this.fb.group({
    nombre: [, Validators.required],
    clave: [, Validators.required],
    accion: [, Validators.required]
  });

  Formulario2: FormGroup = this.fb.group({
    id: [],
    nombre: [, Validators.required],
    clave: [, Validators.required],
    accion: [, Validators.required]
  });


  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService, private message: MessageService) { }

  ngOnInit() {

  }


  showDialog() {
    this.visible = true;
  }
  showDVDialog() {
    this.visibleVar = true;

    console.log(this.selectedPermisos);

  }
  showDDialog(id: any) {
    this.visibleDel = true;
    this.IDd = id;
  }

  deleteSelected() {
    this.disableDV = true;

    console.log(this.selectedPermisos);

    this.selectedPermisos.forEach((permiso: any) => {
      this.service.delete('permisos/delete/' + permiso.id).subscribe((dato: any) => {
        console.log(permiso.id);

      });

    });
    this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminados con exito' });
    setTimeout(() => {
      location.reload();
      this.disableDV = false;
    }, 3000);

  }

  getOne(id: any) {
    this.visibleE = true;

    this.service.get('permisos/getOne/' + id).subscribe((dato: any) => {

      if (dato.data) {
        this.Formulario2.patchValue({
          id: dato.data.id,
          nombre: dato.data.nombre,
          clave: dato.data.clave,
          accion: dato.data.accion,
        });
      }
    });

  }

  delete() {
    this.disableD = true;

    this.service.delete('permisos/delete/' + this.IDd).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminado con exito' });
        setTimeout(() => {
          location.reload();
          this.disableD = false;
        }, 750);
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro' });
        this.disableD = false;
      }
    });

  }

  update() {
    this.disableU = true;

    console.log(this.Formulario2.value);

    this.service.put('permisos/update/' + this.Formulario2.controls['id'].value, this.Formulario2.value).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Actualizado con exito' });
        this.visible = false;
        setTimeout(() => {
          location.reload();
          this.disableU = false;
        }, 750);

      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actializar el registro' });
        this.visible = false;
        this.disableU = false;
      };

    });

  }

  add() {
    this.disableA = true

    console.log(this.Formulario.value);

    this.service.post('permisos/insert', this.Formulario.value).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Agregado con exito' });
        this.visible = false;
        setTimeout(() => {
          location.reload();
          this.disableA = false;
        }, 750);
      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el registro' });
        this.visible = false;
        this.disableA = false;

      };

    });

  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.permisos.length; i++) {
      if (this.permisos[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  filterSearch(event: any) {
    console.log(this.selectedPermisos);
    return event.target.value;
    console.log(event.target.value);
  }

  getInfo(event: TableLazyLoadEvent) {
    this.loading = true;
    this.service.post('permisos/getAll', event).subscribe((dato: any) => {
      console.log(dato);

      if (dato) {
        this.permisos = dato.data;
        this.total = dato.count;
        this.loading = false;

      } else {
        this.message.add({ severity: 'warn', summary: 'Ups', detail: 'tabla vacia' });
      }
    });

  }

  campoValido(campo: string) {
    return this.Formulario.controls[campo].errors && this.Formulario.controls[campo].touched;
  };

  campoValido2(campo: string) {
    return this.Formulario2.controls[campo].errors && this.Formulario2.controls[campo].touched;
  }

  getSeverity() {

    var random = Math.floor(Math.random() * 4) + 1;
    switch (random) {
      case 1:
        return 'success';
      case 2:
        return 'info';
      case 3:
        return 'warning';
      case 4:
        return 'danger';

      default:
        return 'info';

    }

  }

}
