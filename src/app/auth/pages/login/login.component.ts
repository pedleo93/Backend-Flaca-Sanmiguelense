
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


  Formulario: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService) {
    this.CrearFormulario();
  }

  ngOnInit() {

  }

  onLoggedin() {
    // this.submitted = true;
    // if (this.Formulario.invalid) {
    //   return;
    // }
    // console.log(this.Formulario.value);

    // this.service.post(this.modelo, this.Formulario.value, 'login').subscribe((data: any) => {
    //   console.log(data);
    //   if (data) {
    //     console.log('Loggeado');
    //     this.router.navigate(['/principal']);
    //   } else {
    //     console.log('Error');
    //   }
    // });

  }

  CrearFormulario() {
    this.Formulario = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {

  }

  editProduct(product: any) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(puduct: any) {

  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {

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

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  filterSearch(event: any) {
    console.log(this.selectedProducts);
    return event.target.value;
    console.log(event.target.value);
  }


  getInfo(event: TableLazyLoadEvent) {
    
    this.service.post('productos/all', event).subscribe((dato: any) => {
      console.log(dato);

      if (dato) {
        this.products = dato.data;
        this.total = dato.data.total;
        this.loading = false;
      }else{
        console.log("error");
      }
    });

  }
}
