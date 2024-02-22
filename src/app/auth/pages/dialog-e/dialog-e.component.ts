import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dialog-e',
  templateUrl: './dialog-e.component.html',
  styleUrls: ['./dialog-e.component.css']
})

export class DialogEComponent {

  Formulario: FormGroup = this.fb.group({
    nombre: [, Validators.required],
    descripcion: [, Validators.required],
    categoria: [, Validators.required],
    genero: [, Validators.required],
    url: [, Validators.required],
  });

  constructor(private fb: FormBuilder) {
    localStorage.clear()
  }

  visible: boolean = false;

  categorias = [

    { categoria: 'DC Comics' },
    { categoria: 'Marvel Comic' },
    { categoria: 'Otros' },

  ]

  generos = [
    { genero: 'Hombre' },
    { genero: 'Mujer' }
  ]



  showDialog() {
    this.visible = true;
  }

  info() {
    console.log(this.Formulario.value);
  }

}
