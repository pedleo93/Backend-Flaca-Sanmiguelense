import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-registro-convocatorias',
  templateUrl: './registro-convocatorias.component.html',
  styleUrls: ['./registro-convocatorias.component.css']
})
export class RegistroConvocatoriasComponent {
  calls: any[] = [];
  loading: boolean = true;
  dialogVisible: boolean = false;
  dialogHeader: string = '';
  callForm: FormGroup;
  editingCallId: string | null = null;
  selectedCalls: any[] = []; 
  globalFilterValue: string = '';
  

  constructor(private service: ServicioService, private fb: FormBuilder) {
    this.callForm = this.fb.group({
      participantes: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      pagado: [false], 
      verificado: [false] 
    });
  }

  ngOnInit(): void {
    this.loadCalls();
  }

  loadCalls() {
    this.loading = true;
    this.service.get('registro-convocatorias').subscribe(
      (data: any) => {
        this.calls = data;
        this.loading = false;
      },
      error => {
        console.error('Error loading calls', error);
        this.loading = false;
      }
    );
  }

  showDialogAdd() {
    this.callForm.reset();
    this.dialogHeader = 'AGREGAR REGISTRO';
    this.dialogVisible = true;
    this.editingCallId = null;
  }

  showDialogDelMany() {
    if (this.selectedCalls.length) {
      this.selectedCalls.forEach(call => {
        this.deleteCall(call.id); 
      });
      this.selectedCalls = []; 
    }
  }

  saveCall() {
    if (this.callForm.valid) {
      const data = this.callForm.value;
      if (this.editingCallId) {
        this.service.put(`registro-convocatorias/${this.editingCallId}`, data).subscribe(
          response => {
            this.loadCalls();
            this.dialogVisible = false;
          }
        );
      } else {
        this.service.post('registro-convocatorias', data).subscribe(
          response => {
            this.loadCalls();
            this.dialogVisible = false;
          }
        );
      }
    }
  }

  editCall(call: any) {
    this.callForm.patchValue(call);
    this.dialogHeader = 'Editar Registro';
    this.dialogVisible = true;
    this.editingCallId = call.id;
  }

  deleteCall(callId: string) {
    this.service.delete(`registro-convocatorias/${callId}`).subscribe(
      () => {
        this.loadCalls(); 
      }
    );
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
}
