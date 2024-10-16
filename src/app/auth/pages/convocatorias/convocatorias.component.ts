import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-convocatorias',
  templateUrl: './convocatorias.component.html',
  styleUrls: ['./convocatorias.component.css']
})
export class ConvocatoriasComponent {
  calls: any[] = [];
  callForm: FormGroup;
  dialogVisible: boolean = false;
  loading: boolean = false;
  editing: boolean = false;
  selectedCall: any = null;
  selectedCalls: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ServicioService,
    private messageService: MessageService
  ) {
    this.callForm = this.fb.group({
      nombre: ['', Validators.required],
      reglas: ['', Validators.required],
      fecha_cierre: [null, Validators.required],
      costo: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadCalls();
  }

  loadCalls() {
    this.loading = true;
    this.service.get('convocatorias').subscribe((data: any) => {
      this.calls = data;
      this.loading = false;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading calls' });
      this.loading = false;
    });
  }

  showDialogAdd() {
    this.dialogVisible = true;
    this.editing = false;
    this.callForm.reset();
  }

  editCall(call: any) {
    this.dialogVisible = true;
    this.editing = true;
    this.selectedCall = call;
    this.callForm.patchValue({
      nombre: call.nombre,
      reglas: call.reglas,
      fecha_cierre: this.formatDate(new Date(call.fecha_cierre)), 
      costo: call.costo
    });
  }

  saveCall() {
    if (this.callForm.invalid) return; 
    this.editing ? this.updateCall() : this.addCall();
  }

  addCall() {
    const formData = this.prepareFormData();

    this.service.post('convocatorias', formData).subscribe(() => {
      this.dialogVisible = false;
      this.loadCalls();
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Convocatoria agregada correctamente' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al agregar la convocatoria' });
    });
  }

  updateCall() {
    const formData = this.prepareFormData();

    this.service.patch(`convocatorias/${this.selectedCall.id}`, formData).subscribe(() => {
      this.dialogVisible = false;
      this.loadCalls();
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Convocatoria actualizada correctamente' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la convocatoria' });
    });
  }

  deleteCall(id: string) {
    this.service.delete(`convocatorias/${id}`).subscribe(() => {
      this.loadCalls();
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Convocatoria eliminada correctamente' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la convocatoria' });
    });
  }
  showDialogDelMany() {
    if (this.selectedCalls.length) {
      this.selectedCalls.forEach(call => {
        this.deleteCall(call.id); 
      });
      this.selectedCalls = []; 
    }
  }

  
  private prepareFormData() {
    const formData = this.callForm.value;
    formData.fecha_cierre = this.formatDate(formData.fecha_cierre);
    return formData;
  }

  fieldInvalid(field: string) {
    return this.callForm.controls[field]?.errors && this.callForm.controls[field]?.touched; // Uso de encadenamiento opcional
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  }

  get dialogHeader() {
    return this.editing ? 'EDITAR CONVOCATORIA' : 'AGREGAR CONVOCATORIA';
  }
}
