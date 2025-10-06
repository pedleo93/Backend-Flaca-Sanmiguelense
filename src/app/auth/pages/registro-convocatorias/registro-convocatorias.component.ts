import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-registro-convocatorias',
  templateUrl: './registro-convocatorias.component.html',
  styleUrls: ['./registro-convocatorias.component.css'],
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
  detailVisible = false;

  pago: number | null = null;

  constructor(
    private service: ServicioService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.callForm = this.fb.group({
      id_convocatoria: [null, Validators.required],
      participantes: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      pagado: [false],
      verificado: [false],
    });
  }

  ngOnInit(): void {
    this.loadCalls();
    this.loadConvocatorias();
  }

  loadConvocatorias() {
    this.service.get('registro-convocatorias').subscribe(
      (data) => {
        this.convocatorias = data;
      },
      (error) => {
        console.error('Error loading convocatorias', error);
      }
    );
  }
  loadCalls() {
    this.loading = true;
    this.service.get('registro-convocatorias').subscribe(
      (data: any) => {
        this.calls = data.map((call: { id_convocatoria: any }) => {
          const convocatoria = this.convocatorias.find(
            (c: { id: any }) => c.id === call.id_convocatoria
          );
          return {
            ...call,
            convocatoria: convocatoria || { nombre: 'Sin Convocatoria' },
          };
        });
        this.loading = false;
      },
      (error) => {
        console.error('Error loading calls', error);
        this.loading = false;
      }
    );
  }

  showDialogAdd() {
    this.callForm.reset({ pagado: false, verificado: false });
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
      verificado: this.callForm.value.verificado ? 1 : 0,
    };

    if (this.editingCallId) {
      this.service
        .put(`registro-convocatorias/${this.editingCallId}`, data)
        .subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Registro actualizado correctamente',
            });
            this.loadCalls();
            this.dialogVisible = false;
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el registro',
            });
          }
        );
    } else {
      this.service.post('registro-convocatorias', data).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro guardado correctamente',
          });
          this.loadCalls();
          this.dialogVisible = false;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el registro',
          });
        }
      );
    }
  }
  editCall(call: any) {
    this.callForm.patchValue({
      id_convocatoria: call.id_convocatoria,
      participantes: call.participantes,
      correo: call.correo,
      pagado: call.pagado === 1,
      verificado: call.verificado === 1,
    });
    this.dialogHeader = 'Editar Registro';
    this.dialogVisible = true;
    this.editingCallId = call.id;
  }

  deleteCall(id: number) {
    this.selectedCall = this.calls.find((call) => call.id === id);
    this.visibleDelete = true;
    this.disableDelete = false;
  }

  deleteSelectedCalls() {
    const deleteCallsObservables = this.selectedCalls.map((call) =>
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
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Registro eliminado correctamente',
          });
          this.visibleDelete = false;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el registro',
          });
        }
      );
    }
  }

  showDialogDelMany() {
    this.visibleDeleteMany = true;
    this.disableDeleteMany = this.selectedCalls.length === 0;
  }

  deleteSelected() {
    const deleteRequests = this.selectedCalls.map((call) =>
      this.service.delete(`registro-convocatorias/${call.id}`).toPromise()
    );

    Promise.all(deleteRequests)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registros eliminados correctamente',
        });
        this.loadCalls();
        this.visibleDeleteMany = false;
        this.selectedCalls = [];
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un problema al eliminar los registros',
        });
      });
  }

  viewDetails(call: any) {
    this.selectedCall = {
      ...call,
      fechaPago: this.addDays(call.created_at, 2),
    };
    this.pago = Number(call.pagado ?? 0);
    this.dialogHeader = 'Detalles del Registro';
    this.detailVisible = true;
  }

  private addDays(date: Date, days: number): Date | null {
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

  updatePago() {
  if (!this.selectedCall?.id || this.pago === null) return;

  const id  = this.selectedCall.id;
  const url = `registro-convocatorias/pago/${id}`;

  const req$ = this.pago === 1
    ? this.service.patch(url, {})
    : this.pago === 2
    ? this.service.put(url, {})
    : this.service.delete(url);

  req$.subscribe({
    next: () => {
      this.selectedCall.pagado = this.pago;
      const i = this.calls.findIndex(c => c.id === id);
      if (i !== -1) this.calls[i].pagado = this.pago;

      this.messageService.add({
        severity: 'success',
        summary: 'Pago actualizado',
        detail: `Estado: ${this.statusPago(this.pago)}`
      });
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err?.error?.message || 'No se pudo actualizar el pago'
      });
    },
  });
}
}
