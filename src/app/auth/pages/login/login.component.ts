import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../../../provider/servicio.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [MessageService],
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  Formulario: FormGroup = this.fb.group({
    email: [, Validators.required],
    password: [, Validators.required],
  });

  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService, private message: MessageService) {
    localStorage.clear();
  }

  ngOnInit() {}

  login() {
    this.router.navigate(['/login/lista']);
    
    localStorage.setItem("usuario", this.Formulario.controls['email'].value);
  }

  campoValido(campo: string) {
    return this.Formulario.controls[campo].errors && this.Formulario.controls[campo].touched;
  };


}
