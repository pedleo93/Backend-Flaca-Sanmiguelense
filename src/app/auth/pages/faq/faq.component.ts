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
  filteredQuestions: any[] = [...this.questions];
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


  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService, private message: MessageService) {

  }

  ngOnInit() { this.getAll() }

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

  filterSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm) {
      this.filteredQuestions = this.questions.filter((question: any) =>
        question.pregunta.toLowerCase().includes(searchTerm) ||
        question.respuesta.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredQuestions = [...this.questions];
    }
  }

  deleteSelected() {
    this.disableDeleteMany = true;

    const deletePromises = this.selectedQuestions.map((product: any) => {
      return this.service.delete('faqs/' + product.id).toPromise();
    });

    Promise.all(deletePromises).then((results: any[]) => {
      let allSuccess = true;

      results.forEach((info: any) => {
        if (info.estatus !== true) {
          allSuccess = false;
        }
      });

      if (allSuccess) {
        this.message.add({ severity: 'success', summary: 'Éxito!', detail: 'Eliminados con éxito' });
        setTimeout(() => {
          location.reload();
          this.disableDeleteMany = false;
        }, 1000);

      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar algunos registros' });
        this.disableDeleteMany = false;
      }

    }).catch((error) => {
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar los registros' });
      this.disableDeleteMany = false;
    });
  }


  delete() {
    this.disableDelete = true;

    this.service.delete('faqs/' + this.idDelete).subscribe((info: any) => {

      if (info.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Elimando con exito' });
        setTimeout(() => {
          location.reload();
          this.disableDelete = false;
        }, 1000);
      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el registro' });
        this.disableDelete = false;
      }
    });
  }

  getAll() {
    this.loading = true;

    this.service.get('faqs').subscribe((info: any) => {
      if (info) {
        this.questions = info;
        this.filteredQuestions = [...this.questions];
        this.total = info.length;
        this.loading = false;
      } else {
        this.message.add({ severity: 'warn', summary: 'Ups', detail: 'Tabla vacía' });
        this.loading = false;
      }
    });
  }


  getOne(id: any) {
    this.visibleUpdate = true;

    this.service.get('faqs/' + id).subscribe((info: any) => {

      if (info) {
        this.FormUpdate.patchValue({
          id: info.data.id,
          pregunta: info.data.pregunta,
          respuesta: info.data.respuesta
        });
      }
    });

  }

  update() {
    this.disableUpdate = true;

    console.log(this.FormUpdate.value);

    this.service.patch('faqs/' + this.FormUpdate.controls['id'].value, this.FormUpdate.value).subscribe((info: any) => {

      if (info.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Actualizado con exito' });
        this.visibleAdd = false;
        setTimeout(() => {
          location.reload();
          this.disableUpdate = false;
        }, 1000);

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
        }, 1000);
      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el registro' });
        this.visibleAdd = false;
        this.disableAdd = false;

      };

    });

  }


  validateFormAdd(campo: string) {
    return this.FormAdd.controls[campo].errors && this.FormAdd.controls[campo].touched;
  };

  validateFormUpdate(campo: string) {
    return this.FormUpdate.controls[campo].errors && this.FormUpdate.controls[campo].touched;
  }

}
