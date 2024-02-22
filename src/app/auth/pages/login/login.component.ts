
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../../../provider/servicio.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})


export class LoginComponent implements OnInit {

  products: any = [];
  productDialog: boolean = false;
  product: any;
  selectedProducts: any;
  submitted: boolean = false;
  loading = true;
  modelo = 'login';
  date: any;
  total = 0;
  visible: boolean = false;
  visibleE: boolean = false;
  visibleDel: boolean = false;
  visibleVar: boolean = false;
  categorias = [
    { categoria: 'DC Comics' },
    { categoria: 'Marvel Comic' },
    { categoria: 'Otros' },
  ]
  generos = [
    { genero: 'Hombre' },
    { genero: 'Mujer' }
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


  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService) { }

  ngOnInit() {

  }


  showDialog() {
    this.visible = true;
  }


  deleteSelected() {

    this.visibleVar = true;
  }

  getOne(id: any) {
    this.visibleE = true;

    this.service.get('getOne/' + id).subscribe((dato: any) => {

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

  delete(id: any) {

    this.visibleDel = true;

    this.service.delete('delete/' + id).subscribe((dato: any) => {

      if (dato.estatus) {
        
      }
    });

  }

  save() {

  }

  add() {

    console.log(this.Formulario.value);

    this.service.post('insert', this.Formulario.value).subscribe((dato: any) => {

      if (dato.estatus == true) {
        alert("Registro agregado");
        this.visible = false;
        window.location.reload();
      }
      else {
        alert("Resgistro incorrecto");
        this.visible = false;

      };

    });
  }

  info() {
    console.log(this.Formulario.value);
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

    this.service.post('getAll', event).subscribe((dato: any) => {
      console.log(dato);

      if (dato) {
        this.products = dato.data;
        this.total = dato.data.total;
        this.loading = false;
      } else {
        console.log("error");
      }
    });

  }
}
