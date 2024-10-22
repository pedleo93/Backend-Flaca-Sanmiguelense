import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-registro-convocatorias',
  templateUrl: './registro-convocatorias.component.html',
  styleUrls: ['./registro-convocatorias.component.css']
})
export class RegistroConvocatoriasComponent {
  call: any;
  calls: any[] = [];
  loading: boolean = true;
  dialogVisible: boolean = false;
  dialogHeader: string = '';
  callForm: FormGroup;
  editingCallId: string | null = null;
  selectedCalls: any[] = []; 
  globalFilterValue: string = '';
  selectedCall: any;



  visibleDelete: boolean = false;
  visibleDeleteMany: boolean = false;
  idDelete: string | null = null;
  disableDeleteMany: boolean = true;
  disableDelete: boolean = true;
  convocatorias: any;
  selectedConvocatoria: any;
  

  constructor(private service: ServicioService, private fb: FormBuilder,  private messageService: MessageService) {
  
    this.callForm = this.fb.group({
      id_convocatoria: [null, Validators.required],
      participantes: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      pagado: [false],
      verificado: [false]
  });
  }

  ngOnInit(): void {
    this.loadCalls();
    this.loadConvocatorias();
  }

  
  loadConvocatorias() {
    this.service.get('convocatorias').subscribe(data => {
        this.convocatorias = data; 
    }, error => {
        console.error('Error loading convocatorias', error);
    });
}
loadCalls() {
  this.loading = true;
  this.service.get('registro-convocatorias').subscribe(
      (data: any) => {
          this.calls = data.map((call: { id_convocatoria: any; }) => {
              const convocatoria = this.convocatorias.find((c: { id: any; }) => c.id === call.id_convocatoria);
              return {
                  ...call,
                  convocatoria: convocatoria || { nombre: 'Sin Convocatoria' } 
              };
          });
          this.loading = false;
      },
      error => {
          console.error('Error loading calls', error);
          this.loading = false;
      }
  );
}

  showDialogAdd() {
    this.callForm.reset({pagado: false, verificado: false });
    this.dialogHeader = 'AGREGAR REGISTRO';
    this.dialogVisible = true;
    this.editingCallId = null;
  }

  saveCall() {
    const convocatoria = this.callForm.value.id_convocatoria;
    const data = {
        id_convocatoria: convocatoria.id, 
        participantes: this.callForm.value.participantes,
        correo: this.callForm.value.correo,
        pagado: this.callForm.value.pagado ? 1 : 0,
        verificado: this.callForm.value.verificado ? 1 : 0
    };

    if (this.editingCallId) {
      
        this.service.put(`registro-convocatorias/${this.editingCallId}`, data).subscribe(response => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro actualizado correctamente' });
            this.loadCalls();
            this.dialogVisible = false;
        }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el registro' });
        });
    } else {
        this.service.post('registro-convocatorias', data).subscribe(response => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado correctamente' });
            this.loadCalls(); 
            this.dialogVisible = false;
        }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el registro' });
        });
    }
}
editCall(call: any) {
  this.callForm.patchValue({
      id_convocatoria: call.id_convocatoria, 
      participantes: call.participantes,
      correo: call.correo,
      pagado: call.pagado === 1,
      verificado: call.verificado === 1
  });
  this.dialogHeader = 'Editar Registro';
  this.dialogVisible = true;
  this.editingCallId = call.id;
}

deleteCall(id: number) {
  this.selectedCall = this.calls.find(call => call.id === id);
  this.visibleDelete = true;
  this.disableDelete = false; 
}

  deleteSelectedCalls() {
    const deleteCallsObservables = this.selectedCalls.map(call => 
      this.service.delete(`registro-convocatorias/${call.id}`)
    );
  }

  loadLazyCalls(event: any) {
    this.loadCalls();
  }
  applyGlobalFilter(event: any, dt: any) {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  showDialogDelete(id: string) {
    this.visibleDelete = true;
    this.idDelete = id;
  }


  confirmDelete() {
    if (this.idDelete) {
      this.service.delete(`registro-convocatorias/${this.idDelete}`).subscribe(
        () => {
          this.loadCalls();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado correctamente' });
          this.visibleDelete = false;
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el registro' });
        }
      );
    }
  }

  showDialogDelMany() {
    this.visibleDeleteMany = true; 
    this.disableDeleteMany = this.selectedCalls.length === 0; 
}


  deleteSelected() {
    const deleteRequests = this.selectedCalls.map(call => 
      this.service.delete(`registro-convocatorias/${call.id}`).toPromise()
    );

    Promise.all(deleteRequests)
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registros eliminados correctamente' });
        this.loadCalls();
        this.visibleDeleteMany = false;
        this.selectedCalls = [];
      })
      .catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar los registros' });
      });
  }
}
