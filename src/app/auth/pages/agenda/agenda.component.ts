import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [MessageService]
})

export class AgendaComponent {

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
    lugar: [, Validators.required],
    evento: [, Validators.required],
    descripcion: [, Validators.required],
    fecha_inicial: [, Validators.required],
    fecha_final: [, Validators.required],
  });

  Formulario2: FormGroup = this.fb.group({
    id: [null], // Agrega el campo id aquí
    lugar: [, Validators.required],
    evento: [, Validators.required],
    descripcion: [, Validators.required],
    fecha_inicial: [, Validators.required],
    fecha_final: [, Validators.required],
  });
  


  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService, private message: MessageService) { }

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
    this.disableDV = true;

    console.log(this.selectedProducts);

    this.selectedProducts.forEach((product: any) => {
      this.service.delete('productos/delete/' + product.id).subscribe((dato: any) => {
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
    this.service.get('agendas/' + id).subscribe((dato: any) => {    
      if (dato.data) {
        this.Formulario2.patchValue({
          id: dato.data.id, // Parchamos el valor del id aquí también
          lugar: dato.data.lugar,
          evento: dato.data.evento,
          descripcion: dato.data.descripcion,
          fecha_inicial: dato.data.fecha_inicial,
          fecha_final: dato.data.fecha_final
        });
      }
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


// METODO GET MI PERRO
  getInfo(event: TableLazyLoadEvent) {
    this.loading = true;
    this.service.get('agendas').subscribe((dato: any) => {
      console.log(dato);

      if (dato) {
        this.products = dato;
        this.total = dato.count;
        this.loading = false;

      } else {
        this.message.add({ severity: 'warn', summary: 'Ups', detail: 'tabla vacia' });
      }
    });
  }

  // AGREGAR UNA FOCKING AGENDA NUEVA ALV
  add() {
    this.disableA = true

    console.log(this.Formulario.value);

    this.Formulario.value.fecha_inicial = this.Formulario.value.fecha_inicial.toISOString().replace(
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):.*/,
      '$1-$2-$3 $4:$5'
    );

    this.Formulario.value.fecha_final = this.Formulario.value.fecha_final.toISOString().replace(
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):.*/,
      '$1-$2-$3 $4:$5'
    );

    this.service.post('agendas', this.Formulario.value).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Agregado con exito' });
        this.visible = false;
        setTimeout(() => {
          location.reload();
          this.disableA = false;
        }, 750);      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el registro' });
        this.visible = false;
        this.disableA = false;

      };

    });
  }

  // EDITAR UNA FOCKING AGENDA NUEVA ALV
  update() {
    this.disableU = true;
    console.log(this.Formulario2.value);
  
    // Asegúrate de concatenar correctamente la URL de la API
    const id = this.Formulario2.controls['id'].value;
    this.service.put('agendas/' + id, this.Formulario2.value).subscribe((dato: any) => {
  
      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Éxito!', detail: 'Actualizado con éxito' });
        this.visibleE = false; // Corrige la variable para cerrar el diálogo
        setTimeout(() => {
          location.reload();
          this.disableU = false;
        }, 750);
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el registro' });
        this.visibleE = false;
        this.disableU = false;
      }
    });
  }
  

  // METODO PARA BORRAR PERRO
  delete() {
    this.disableD = true;

    this.service.delete('agendas/' + this.IDd).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Elimando con exito' });
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

  campoValido(campo: string) {
    return this.Formulario.controls[campo].errors && this.Formulario.controls[campo].touched;
  };

  campoValido2(campo: string) {
    return this.Formulario2.controls[campo].errors && this.Formulario2.controls[campo].touched;
  }

}
