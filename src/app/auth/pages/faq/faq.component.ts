import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  providers: [MessageService]
})
export class FaqComponent {

  questions: any = [];
  productDialog: boolean = false;
  question: any;
  selectedQuestions: any = [];
  submitted: boolean = false;
  loading = false;
  total = 0;

  visibleAdd: boolean = false;
  visibleUpdate: boolean = false;
  visibleDelete: boolean = false;
  visibleDelMany: boolean = false;

  idDelete: number = 0;
  disableAdd: boolean = false;
  disableUpdate: boolean = false;
  disableDelete: boolean = false;
  disableDeleteMany: boolean = false;

  FormAdd: FormGroup = this.fb.group({
    pregunta: [, Validators.required],
    respuesta: [, Validators.required]
  });

  FormUpdate: FormGroup = this.fb.group({
    id: [],
    pregunta: [, Validators.required],
    respuesta: [, Validators.required]
  });


  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService, private message: MessageService) { }

  ngOnInit() {}

  showDialogAdd() {
    this.visibleAdd = true;
  }
  
  showDialogDelMany() {
    this.visibleDelMany = true;
    console.log(this.selectedQuestions);
  }

  showDialogDelete(id: any) {
    this.visibleDelete = true;
    this.idDelete = id;
  }

  deleteSelected() {
    this.disableDeleteMany = true;

    console.log(this.selectedQuestions);

    this.selectedQuestions.forEach((product: any) => {
      this.service.delete('faqs/' + product.id).subscribe((info: any) => {
      });

    });
    this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Eliminados con exito' });
    setTimeout(() => {
      location.reload();
      this.disableDeleteMany = false;
    }, 3000);
    
  }

  delete() {
    this.disableDelete = true;

    this.service.delete('faqs/' + this.idDelete).subscribe((info: any) => {

      if (info.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Elimando con exito' });
        setTimeout(() => {
          location.reload();
          this.disableDelete = false;
        }, 750);
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro' });
        this.disableDelete = false;
      }
    });
  }

  getAll(event: TableLazyLoadEvent) {
    this.loading = true;
    // this.service.post('faqs', event).subscribe((info: any) => {
    this.service.get('faqs').subscribe((info: any) => {
      console.log(info);
      this.questions = info      

      // if (info) {
      //   this.questions = info.data;
      //   this.total = info.count;
      //   this.loading = false;

      // } else {
      //   this.message.add({ severity: 'warn', summary: 'Ups', detail: 'tabla vacia' });
      // }
    });

  }

  getOne(id: any) {
    this.visibleUpdate = true;

    this.service.get('faqs/' + id).subscribe((info: any) => {

      if (info.data) {
        this.FormUpdate.patchValue({
          id: info.id,
          pregunta: info.pregunta,
          respuesta: info.respuesta
        });
      }
    });

  }

  update() {
    this.disableUpdate = true;

    console.log(this.FormUpdate.value);

    this.service.patch('faqs' + this.FormUpdate.controls['id'].value, this.FormUpdate.value).subscribe((info: any) => {

      if (info.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Actualizado con exito' });
        this.visibleAdd = false;
        setTimeout(() => {
          location.reload();
          this.disableUpdate = false;
        }, 750);

      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actializar el registro' });
        this.visibleAdd = false;
        this.disableUpdate = false;
      };

    });

  }

  add() {
    this.disableAdd = true

    this.service.post('faqs', this.FormAdd.value).subscribe((info: any) => {

      if (info.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Agregado con exito' });
        this.visibleAdd = false;
        setTimeout(() => {
          location.reload();
          this.disableAdd = false;
        }, 750);      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el registro' });
        this.visibleAdd = false;
        this.disableAdd = false;

      };

    });

  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  filterSearch(event: any) {
    console.log(this.selectedQuestions);
    return event.target.value;
    console.log(event.target.value);
  }


  validateFormAdd(campo: string) {
    return this.FormAdd.controls[campo].errors && this.FormAdd.controls[campo].touched;
  };

  validateFormUpdate(campo: string) {
    return this.FormUpdate.controls[campo].errors && this.FormUpdate.controls[campo].touched;
  }

}
