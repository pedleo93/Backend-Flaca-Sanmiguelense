
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
  selectedProducts: any = [];
  submitted: boolean = false;
  loading = true;
  modelo = 'login';
  date: any;
  total = 0;
  visible: boolean = false;
  visibleE: boolean = false;
  visibleDel: boolean = false;
  visibleVar: boolean = false;
  IDd: number = 0;
  
  categorias = [
     'DC Comics' ,
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


  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService) { }

  ngOnInit() {

  }


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

    console.log(this.selectedProducts);
    
    this.selectedProducts.forEach((product: any) => {
      this.service.delete('delete/' + product.id).subscribe((dato: any) => {
      });
      
    });
    alert("Registros eliminados");
    window.location.reload();
    this.visibleDel = false; 
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

  delete() {

    this.service.delete('delete/' + this.IDd).subscribe((dato: any) => {

      if (dato.estatus == true) {
        alert("Registro eliminado");
        window.location.reload();
        this.visibleDel = false; 
      }
    });

  }

  update() {

    console.log(this.Formulario2.value);

    this.service.put('update/'+ this.Formulario2.controls['id'].value, this.Formulario2.value).subscribe((dato: any) => {

      if (dato.estatus == true) {
        alert("Registro actualizado");
        this.visible = false;
        window.location.reload();
      }
      else {
        alert("Resgistro incorrecto");
        this.visible = false;

      };

    });

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
        alert("Registro incorrecto");
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
        this.total = dato.count;
        this.loading = false;
      } else {
        console.log("error");
      }
    });

  }
}
