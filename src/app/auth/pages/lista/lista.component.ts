import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  providers: [MessageService]
})
export class ListaComponent {

  products: any = [];
  productDialog: boolean = false;
  product: any;
  selectedProducts: any = [];
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

  categorias = [
    'DC Comics',
    'Marvel Comics',
    'TMNT',
  ]

  Formulario: FormGroup = this.fb.group({
    nombre: [, Validators.required],
    descripcion: [, Validators.required],
    categoria: [, Validators.required],
    genero: [, Validators.required],
    url: [, Validators.required],
  });

  Formulario2: FormGroup = this.fb.group({
    id: [],
    nombre: [, Validators.required],
    descripcion: [, Validators.required],
    categoria: [, Validators.required],
    genero: [, Validators.required],
    url: [, Validators.required],
  });


  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService, private message: MessageService) { }

  ngOnInit() {}

  showDialog() {
    this.visible = true;
  }

  showDVDialog() {
    this.visibleVar = true;
    console.log(this.selectedProducts);
  }

  showDDialog(id: any) {
    this.visibleDel = true;
    this.IDd = id;
  }

  deleteSelected() {
    this.disableDV = true;

    console.log(this.selectedProducts);

    this.selectedProducts.forEach((product: any) => {
      this.service.delete('productos/delete/' + product.id).subscribe((dato: any) => {
      });

    });
    this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Preguntas eliminadas con exito' });
    setTimeout(() => {
      location.reload();
      this.disableDV = false;
    }, 3000);
    
  }

  delete() {
    this.disableD = true;

    this.service.delete('productos/delete/' + this.IDd).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Pregunta eliminada con exito' });
        setTimeout(() => {
          location.reload();
          this.disableD = false;
        }, 750);
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se ha podido eliminar la pregunta'});
        this.disableD = false;
      }
    });

  }

  getOne(id: any) {
    this.visibleE = true;

    this.service.get('productos/getOne/' + id).subscribe((dato: any) => {

      if (dato.data) {
        this.Formulario2.patchValue({
          id: dato.data.id,
          nombre: dato.data.nombre,
          descripcion: dato.data.descripcion,
          categoria: dato.data.categoria,
          genero: dato.data.genero,
          url: dato.data.url
        });
      }
    });

  }


  update() {
    this.disableU = true;

    console.log(this.Formulario2.value);

    this.service.put('productos/update/' + this.Formulario2.controls['id'].value, this.Formulario2.value).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Pregunta actualizada con exito' });
        this.visible = false;
        setTimeout(() => {
          location.reload();
          this.disableU = false;
        }, 750);

      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se ha podido actualizar la pregunta' });
        this.visible = false;
        this.disableU = false;
      };

    });

  }

  add() {
    this.disableA = true

    console.log(this.Formulario.value);

    this.service.post('productos/insert', this.Formulario.value).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Pregunta agregada con exito' });
        this.visible = false;
        setTimeout(() => {
          location.reload();
          this.disableA = false;
        }, 750);      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se ha podido agregar la pregunta' });
        this.visible = false;
        this.disableA = false;

      };

    });

  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  filterSearch(event: any) {
    console.log(this.selectedProducts);
    return event.target.value;
    console.log(event.target.value);
  }

  getInfo(event: TableLazyLoadEvent) {
    this.loading = true;
    this.service.post('productos/getAll', event).subscribe((dato: any) => {
      console.log(dato);

      if (dato) {
        this.products = dato.data;
        this.total = dato.count;
        this.loading = false;

      } else {
        this.message.add({ severity: 'warn', summary: 'Ups', detail: 'Tabla vacia' });
      }
    });

  }

  campoValido(campo: string) {
    return this.Formulario.controls[campo].errors && this.Formulario.controls[campo].touched;
  };

  campoValido2(campo: string) {
    return this.Formulario2.controls[campo].errors && this.Formulario2.controls[campo].touched;
  }

}
