import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-convocatorias',
  templateUrl: './convocatorias.component.html',
  styleUrls: ['./convocatorias.component.css'],
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
  totalMoney: number = 0;
  stats: any = {};
  total_registros: number = 0;

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
  totalRegisters: number = 0;
  numberRegisters: number = 0;
  totalAmount: number = 0;

  pago: number | null = null;
  saving: boolean = false;
  fechaPago: Date | null = null;

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
      imagen: ['', Validators.required],
    });
    this.registerForm = this.fb.group({
      id_convocatoria: [null, Validators.required],
      nombre_equipo: ['', Validators.required],
      participantes: ['', Validators.required],
      tipo_participante: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      procedencia: ['', Validators.required],
      pagado: [0],
    });
  }

  ngOnInit() {
    this.loadCalls();
  }

  loadCalls() {
    this.loading = true;
    // Convocatorias
    this.service.get('convocatorias').subscribe(
      (data: any) => {
        this.calls = data;
        this.filteredCalls = [...this.calls];
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading calls',
        });
        this.loading = false;
      }
    );

    this.service.get('registro-convocatorias').subscribe(
      (data: any) => {
        this.stats = data;
        this.loading = false;
        console.log(this.stats);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading stats',
        });
      }
    );
    this.loading = false;
  }

  filterCalls(event: any) {
    const query = event.target.value.trim().toLowerCase();
    this.filteredCalls = this.calls.filter(
      (call) =>
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
      imagen: call.imagen,
    });
  }

  saveCall() {
    if (this.callForm.invalid) return;
    this.editing ? this.updateCall() : this.addCall();
  }

  addCall() {
    const formData = this.prepareFormData();

    this.service.post('convocatorias', formData).subscribe(
      () => {
        this.dialogVisible = false;
        this.loadCalls();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Convocatoria agregada correctamente',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al agregar la convocatoria',
        });
      }
    );
  }

  updateCall() {
    const formData = this.prepareFormData();

    this.service
      .put(`convocatorias/${this.selectedCall.id}`, formData)
      .subscribe(
        () => {
          this.dialogVisible = false;
          this.loadCalls();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Convocatoria actualizada correctamente',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la convocatoria',
          });
        }
      );
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
      detail:
        '¿Estás seguro de que deseas eliminar los registros seleccionados?',
      sticky: true,
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
              detail: `No se puede eliminar la convocatoria ${this.selectedCalls[index].nombre}, ya que tiene registros asociados`,
            });
          }
        });

        if (successCount > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `${successCount} convocatorias eliminadas correctamente`,
          });
        }

        if (errorCount > 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${errorCount} convocatorias no se pudieron eliminar`,
          });
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
    return (
      this.callForm.controls[field]?.errors &&
      this.callForm.controls[field]?.touched
    );
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
  get botonActualizar(): boolean {
    const control = this.registerForm.controls;
    const usado = Object.keys(control).some(
      (k) => k !== 'pagado' && control[k].dirty
    );
    return usado && !this.saving && this.registerForm.valid;
  }

  getAll() {
    this.loading = true;
    this.service.get('registro-convocatorias').subscribe((info: any) => {
      if (info) {
        this.calls = info;
        this.loading = false;
      } else {
        this.message.add({
          severity: 'warn',
          summary: 'Ups',
          detail: 'Tabla vacía',
        });
        this.loading = false;
      }
    });
  }

  showDialogDelete(id: string) {
    this.visibleDelete = true;
    this.idDelete = id;
  }

  confirmDelete() {
    this.service
      .delete(`convocatorias/${this.selectedCallId}`)
      .subscribe(() => {
        this.visibleDelete = false;
        this.loadCalls();
      });
  }
  cancelDelete() {
    this.visibleDelete = false;
  }

  saveRegsiter() {
    if (this.registerForm.invalid || this.saving) return;

    const pagoActual = (this.selectedCall?.pagado ?? 0) as 0 | 1 | 2;

    const { pagado, ...rest } = this.registerForm.value as any;

    const payload: any = {
      id_convocatoria:
        typeof rest.id_convocatoria === 'object'
          ? rest.id_convocatoria.id
          : rest.id_convocatoria,
      nombre_equipo: rest.nombre_equipo,
      participantes: rest.participantes,
    };

    this.saving = true;
    this.service
      .patch(`registro-convocatorias/${this.editingRegisterId}`, payload)
      .subscribe({
        next: () => {
          this.updatePago(pagoActual, { silent: true });

          Object.assign(this.selectedCall, payload);
          const i = this.calls.findIndex(
            (c) => c.id === this.editingRegisterId
          );
          if (i !== -1) Object.assign(this.calls[i], payload);

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro actualizado correctamente',
          });
          this.visibleRegister = false;
          this.registerForm.markAsPristine();
          this.registerForm.markAsUntouched();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message || 'No se pudo actualizar el registro',
          });
        },
        complete: () => (this.saving = false),
      });
  }

  viewRegisters(call: string) {
    this.service
      .get(`convocatorias/estadisticas/${call}`)
      .subscribe((data: any) => {
        this.totalRegisters = data.total_registros;
        this.numberRegisters = data.pagados;
        this.totalAmount = data.monto_total;
      });
    this.service.get(`convocatorias/registros/${call}`).subscribe(
      (data: any) => {
        this.currentRegisters = data;
        if (this.currentRegisters.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sin registros',
            detail: 'Esta convocatoria aún no tiene registros',
          });
        } else {
          this.visibleRegisters = true;
        }
      },
      (error) => {
        console.error('Error cargando registros:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los registros',
        });
      }
    );
  }

  editRegister(call: any) {
    this.isEditMode = true;
    this.editingRegisterId = call.id;
    this.visibleRegister = true;

    this.selectedCall = call;
    this.pago = call.pagado;

    this.fechaPago = this.addDays(call.created_at, 2);

    this.registerForm.patchValue({
      id_convocatoria: call.id_convocatoria,
      nombre_equipo: call.nombre_equipo,
      participantes: call.participantes,
      correo: call.correo,
      tipo_participante: call.tipo_participante,
      procedencia: call.procedencia,
      pagado: call.pagado,
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
        this.service.delete(`registro-convocatorias/${registerId}`).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Registro eliminado correctamente',
            });
            this.currentRegisters = this.currentRegisters.filter(
              (r) => r.id !== registerId
            );
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el registro',
            });
          }
        );
      },
    });
  }

  addDays(date: Date, days: number): Date | null {
    if (!date) return null;
    const result = new Date(date);
    if (isNaN(result.getTime())) return null;
    result.setDate(result.getDate() + days);
    return result;
  }
  statusPago(value: number | null | undefined): string {
    if (value === 1) return 'Pagado';
    if (value === 2) return 'Devuelto';
    return 'No pagado';
  }

  statusPagoStyle(
    value: number | null | undefined
  ): 'success' | 'danger' | 'warning' {
    if (value === 1) return 'success';
    if (value === 2) return 'warning';
    return 'danger';
  }

  updatePago(p: 0 | 1 | 2, opts?: { silent?: boolean }) {
    if (!this.selectedCall?.id) return;

    const id = this.selectedCall.id;
    const url = `registro-convocatorias/pago/${id}`;
    const req$ =
      p === 1
        ? this.service.patch(url, {})
        : p === 2
        ? this.service.put(url, {})
        : this.service.delete(url);

    req$.subscribe({
      next: () => {
        this.selectedCall.pagado = p;
        const i = this.calls.findIndex((c) => c.id === id);
        if (i !== -1) this.calls[i].pagado = p;

        const ctrl = this.registerForm.get('pagado');
        ctrl?.setValue(p, { emitEvent: false });
        ctrl?.markAsPristine();
        ctrl?.markAsUntouched();

        if (!opts?.silent) {
          this.messageService.add({
            severity: 'success',
            summary: 'Pago actualizado',
            detail: `Estado: ${this.statusPago(p)}`,
          });
        }
      },
      error: (err) => {
        this.registerForm
          .get('pagado')
          ?.setValue(this.selectedCall.pagado, { emitEvent: false });

        if (!opts?.silent) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message || 'No se pudo actualizar el pago',
          });
        }
      },
    });
  }
}
