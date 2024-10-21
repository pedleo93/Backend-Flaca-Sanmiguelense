import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { ServicioService } from 'src/app/provider/servicio.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [MessageService, DatePipe]
})

export class AgendaComponent {

  products: any = [];
  filteredQuestions: any[] = [...this.products];
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
    id: [null],
    lugar: [, Validators.required],
    evento: [, Validators.required],
    descripcion: [, Validators.required],
    fecha_inicial: [, Validators.required],
    fecha_final: [, Validators.required],
  });
  eventTable: any;


  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService, private message: MessageService, private datePipe: DatePipe) { }

  ngOnInit() { this.getInfo() }


showDialog() {
    this.Formulario.reset();
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
      this.service.delete('agendas/' + product.id).subscribe((dato: any) => {
      });

    });
    this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminados con exito' });
    setTimeout(() => {
      this.getInfo();
      this.disableDV = false;
    }, 750);
    
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
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm) {
      this.filteredQuestions = this.products.filter((question: any) =>
        question.lugar        .toLowerCase().includes(searchTerm) ||
        question.descripcion  .toLowerCase().includes(searchTerm) ||
        question.evento       .toLowerCase().includes(searchTerm) ||
        question.fecha_inicial.toLowerCase().includes(searchTerm) ||
        question.fecha_final  .toLowerCase().includes(searchTerm)
      );
      console.log(this.filterSearch);
      
    } else {
      this.filteredQuestions = [...this.products];
    }
  }


// METODO GET MI PERRO
  getInfo() {    
    this.loading = true;

    this.service.get('agendas').subscribe((dato: any) => {
      console.log(dato);

      if (dato) {
        this.products = dato;
        this.total = dato.count;
        this.filteredQuestions = [...this.products];
        this.loading = false;

      } else {
        this.message.add({ severity: 'warn', summary: 'Ups', detail: 'tabla vacia' });
      }
    });
  }

  // AGREGAR UNA FOCKING AGENDA NUEVA ALV
  add() {
    this.disableA = true;
  
    let formValue = { ...this.Formulario.value };
  
    // Formatear la fecha inicial y fecha final al formato adecuado
    if (formValue.fecha_inicial) {
      formValue.fecha_inicial = this.formatDateToCustom(formValue.fecha_inicial);
    }
  
    if (formValue.fecha_final) {
      formValue.fecha_final = this.formatDateToCustom(formValue.fecha_final);
    }
  
    this.service.post('agendas', formValue).subscribe((dato: any) => {
      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Agregado con exito' });
        this.visible = false;
        setTimeout(() => {
          this.getInfo();
          this.disableA = false;
        }, 750);
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el registro' });
        this.visible = false;
        this.disableA = false;
      }
    });
  }
  

  // EDITAR UNA FOCKING AGENDA NUEVA ALV
  update() {
    this.disableU = true;
  
    let formValue = { ...this.Formulario2.value };

    if (formValue.fecha_inicial) {
      formValue.fecha_inicial = this.formatDateToCustom(formValue.fecha_inicial);
    }
  
    if (formValue.fecha_final) {
      formValue.fecha_final = this.formatDateToCustom(formValue.fecha_final);
    }
  
    console.log(formValue);
  
    const id = this.Formulario2.controls['id'].value;
  
    this.service.put('agendas/' + id, formValue).subscribe((dato: any) => {
      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Éxito!', detail: 'Actualizado con éxito' });
        this.visibleE = false;
        setTimeout(() => {
          this.getInfo();
          this.disableU = false;
        }, 750);
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el registro' });
        this.visibleE = false;
        this.disableU = false;
      }
    });
  }

  formatDateToCustom(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Asegurar dos dígitos
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
  
    // Formato MySQL: YYYY-MM-DD HH:MM:SS
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // METODO PARA BORRAR PERRO
  delete() {
    this.disableD = true;
  
    this.service.delete('agendas/' + this.IDd).subscribe((dato: any) => {
      if (dato.estatus === true) {
        this.message.add({ severity: 'success', summary: 'Éxito!', detail: 'Eliminado con éxito' });
        setTimeout(() => {
          this.getInfo();
          this.disableD = false;
          this.visibleDel = false;
        }, 750);
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro' });
        this.disableD = false;
        this.visibleDel = false;
      }
    });
  }
  

  // OBETENER UNO
  getOne(id: any) {
    this.visibleE = true;
    this.service.get('agendas/' + id).subscribe((dato: any) => {    
      if (dato.data) {
        this.Formulario2.patchValue({
          id: dato.data.id,
          lugar: dato.data.lugar,
          evento: dato.data.evento,
          descripcion: dato.data.descripcion,
          fecha_inicial: new Date (dato.data.fecha_inicial),
          fecha_final:new Date (dato.data.fecha_final)
        });
        console.log(this.Formulario2.value);
        
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
