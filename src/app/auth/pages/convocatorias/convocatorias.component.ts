import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
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
  searchQuery: string = '';
  filteredCalls: any[] = [];
  disableDeleteMany: boolean = false;
  selectedQuestions: any;
  message: any;
  records: any[] = [];
  totalMoney: number = 0;

  visibleAdd: boolean = false;
  visibleUpdate: boolean = false;
  visibleDelete: boolean = false;

  idDelete: string = '';
  visibleDeleteMany: boolean = false;
  disableDelete: boolean = false;

  selectedCallId: number | undefined;
  visibleDelMany: boolean = false;

  registerForm: FormGroup;
  selectedConvocatoria: any;
  visibleRegister: boolean = false;
  visibleRegisters = false;
  currentRegisters: any[] = [];
  isEditMode: boolean = false;
  editingRegisterId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private service: ServicioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.callForm = this.fb.group({
      nombre: ['', Validators.required],
      reglas: ['', Validators.required],
      fecha_cierre: [null, Validators.required],
      costo: ['', [Validators.required, Validators.min(0)]],
      imagen: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      id_convocatoria: [null, Validators.required],
      nombre_equipo: ['', Validators.required],
      participantes: ['', Validators.required],
      tipo_participante: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      procedencia: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCalls();
  }

  loadCalls() {
    this.loading = true;
    // Convocatorias
    this.service.get('convocatorias').subscribe((data: any) => {
      this.calls = data;
      this.filteredCalls = [...this.calls];
      this.loading = false;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading calls' });
      this.loading = false;
    });

    // Registros
    this.service.get('registro-convocatorias').subscribe(
      (data: any) => {
        this.records = data;
        const paidCalls = this.calls.filter((call) =>
          this.records.some(
            (record) => record.pagado == 1 && record.id_convocatoria === call.id
          )
        );
        this.totalMoney = this.records
          .filter((record) => record.pagado == 1)
          .reduce((sum, record) => {
            const call = this.calls.find(
              (c) => c.id === record.id_convocatoria
            );
            return call ? sum + call.costo : sum;
          }, 0);


        this.loading = false;
      }, error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading records',
        });
        this.loading = false;
      }
    );
  }

  filterCalls(event: any) {
    const query = event.target.value.trim().toLowerCase();
    this.filteredCalls = this.calls.filter(call =>
      call.nombre.toLowerCase().includes(query) ||
      call.reglas.toLowerCase().includes(query)
    );
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
      costo: call.costo,
      imagen: call.imagen
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

    this.service.put(`convocatorias/${this.selectedCall.id}`, formData).subscribe(() => {
      this.dialogVisible = false;
      this.loadCalls();
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Convocatoria actualizada correctamente' });
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la convocatoria' });
    });
  }
  deleteCall(callId: number) {
    this.selectedCallId = callId;
    this.visibleDelete = true;
  }

  showDialogDelMany() {
    this.visibleDelMany = true;
    console.log(this.selectedCalls);
  }


  confirmDeleteSelected() {
    this.message.clear();
    this.message.add({
      key: 'confirmDelete',
      severity: 'warn',
      summary: 'Confirmar',
      detail: '¿Estás seguro de que deseas eliminar los registros seleccionados?',
      sticky: true
    });
  }

  deleteSelected() {
    this.disableDeleteMany = true;
    const deleteRequests = this.selectedCalls.map((convocatoria: any) =>
      this.service.delete(`convocatorias/${convocatoria.id}`).toPromise()
    );

    Promise.allSettled(deleteRequests)
      .then((results) => {
        let successCount = 0;
        let errorCount = 0;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successCount++;
          } else {
            errorCount++;
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: `No se puede eliminar la convocatoria ${this.selectedCalls[index].nombre}, ya que tiene registros asociados`
            });
          }
        });

        if (successCount > 0) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `${successCount} convocatorias eliminadas correctamente` });
        }

        if (errorCount > 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${errorCount} convocatorias no se pudieron eliminar` });
        }

        this.loadCalls();
      })
      .finally(() => {
        this.disableDeleteMany = false;
        this.visibleDelMany = false;
        this.selectedCalls = [];
      });
  }

  private prepareFormData() {
    const formData = this.callForm.value;
    formData.fecha_cierre = this.formatDate(formData.fecha_cierre);
    return formData;
  }

  fieldInvalid(field: string) {
    return this.callForm.controls[field]?.errors && this.callForm.controls[field]?.touched;
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  }

  get dialogHeader() {
    return this.editing ? 'EDITAR CONVOCATORIA' : 'AGREGAR CONVOCATORIA';
  }

  getAll() {
    this.loading = true;
    this.service.get('registro-convocatorias').subscribe((info: any) => {
      if (info) {
        this.calls = info;
        this.loading = false;
      } else {
        this.message.add({ severity: 'warn', summary: 'Ups', detail: 'Tabla vacía' });
        this.loading = false;
      }
    });
  }

  showDialogDelete(id: string) {
    this.visibleDelete = true;
    this.idDelete = id;
  }

  confirmDelete() {

    this.service.delete(`convocatorias/${this.selectedCallId}`).subscribe(() => {
      this.visibleDelete = false;
      this.loadCalls();
    });
  }
  cancelDelete() {
    this.visibleDelete = false;
  }

  saveRegsiter() {
    if (this.registerForm.invalid) return;
    const formData = { ...this.registerForm.value };

    this.service.patch(`registro-convocatorias/${this.editingRegisterId}`, formData).subscribe(() => {
      this.visibleRegister = false;
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro actualizado correctamente' });
      this.viewRegisters(formData.id_convocatoria);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el registro' });
    });

  }

  viewRegisters(call: string) {
    this.service.get(`convocatorias/registros/${call}`).subscribe(
      (data: any) => {
        this.currentRegisters = data;
        if (this.currentRegisters.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sin registros',
            detail: 'Esta convocatoria aún no tiene registros'
          });
        } else {
          this.visibleRegisters = true;
        }
      },
      error => {
        console.error('Error cargando registros:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los registros'
        });
      }
    );
  }

  editRegister(call: any) {
    this.isEditMode = true;
    this.editingRegisterId = call.id;
    this.visibleRegister = true;

    this.registerForm.patchValue({
      id_convocatoria: call.id_convocatoria,
      nombre_equipo: call.nombre_equipo,
      participantes: call.participantes,
      correo: call.correo,
      tipo_participante: call.tipo_participante,
      procedencia: call.procedencia
    });

    this.registerForm.get('tipo_participante')?.disable();
    this.registerForm.get('correo')?.disable();
    this.registerForm.get('procedencia')?.disable();
  }

  deleteRegister(call: any) {
    const registerId = call;
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este registro?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.service.delete(`registro-convocatorias/${registerId}`).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Registro eliminado correctamente'
          });
          this.currentRegisters = this.currentRegisters.filter(r => r.id !== registerId);
        }, error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el registro'
          });
        });
      }
    });
  }

}
