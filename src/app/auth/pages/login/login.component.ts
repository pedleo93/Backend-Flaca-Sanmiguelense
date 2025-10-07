import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ServicioService } from '../../../provider/servicio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent  {
  Formulario: FormGroup;

  constructor(private formBuilder: FormBuilder, private router:Router, public service: ServicioService,private messageService: MessageService){
    this.Formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }


  onSubmit(){
    if (this.Formulario.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos',  detail: 'Por favor completa los campos correctamente'});
      return;
    }
    this.service.post('login', this.Formulario.value,).subscribe({
      next: (response: any) => {
        console.log('Login exitoso:', response);
        this.messageService.add({ severity: 'success', summary: 'Bienvenido'});

        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));

        setTimeout(() => {
          this.router.navigate(['/admin/convocatorias']);
        }, 1000);

      },
      error: (error) => {
        console.error('Error en login:', error);
        this.messageService.add({ severity: 'error',summary: 'Error de autenticacion', detail: 'Correo o contraseña incorrectos'});
      }
    });
  }

  campoValido(campo: string) {
    return (
      this.Formulario.controls[campo].errors &&
      this.Formulario.controls[campo].touched
    );
  }
}
