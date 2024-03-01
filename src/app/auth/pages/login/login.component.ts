import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../../../provider/servicio.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [MessageService],

})


export class LoginComponent implements OnInit {

  Formulario: FormGroup = this.fb.group({
    email: [, Validators.required],
    password: [, Validators.required],
  });

  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService, private message: MessageService) {

  }

  ngOnInit() {

  }

  login() {

    // this.service.post('', this.Formulario.value).subscribe((dato: any) => {

    //   if (dato == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Iniciando sesión' });
        setTimeout(() => {
          this.router.navigate(['/login/lista']);
        }, 750);
      // }
    //   else {
    //     this.message.add({ severity: 'error', summary: 'Error', detail: 'Usuario no encontrado' });
    //   };

    // });

  }

  campoValido(campo: string) {
    return this.Formulario.controls[campo].errors && this.Formulario.controls[campo].touched;
  };


}
