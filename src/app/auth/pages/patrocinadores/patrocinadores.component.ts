import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { ServicioService } from 'src/app/provider/servicio.service';

@Component({
  selector: 'app-patrocinadores',
  templateUrl: './patrocinadores.component.html',
  styleUrls: ['./patrocinadores.component.css'],
  providers: [MessageService]
})
export class PatrocinadoresComponent {
  patrocinadores: any = [];
  filteredPatrocinadores: any[] = [...this.patrocinadores];
  productDialog: boolean = false;
  patrocinador: any;
  selectedPatrocinadores: any = [];
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
    nombre: [, Validators.required],
    descripcion: [, Validators.required],
    imagen_url: [, Validators.required],
    link: [, Validators.required],
    posicion: [, Validators.required],
    premium: [,]
  });

  Formulario2: FormGroup = this.fb.group({
    id: [, Validators.required],
    nombre: [, Validators.required],
    descripcion: [, Validators.required],
    imagen_url: [, Validators.required],
    link: [, Validators.required],
    posicion: [, Validators.required],
    premium: [,]
  });


  constructor(public router: Router, private fb: FormBuilder, public service: ServicioService, private message: MessageService) { }

  ngOnInit() {
    this.getAll()
  }


  showDialog() {
    this.visible = true;
  }
  showDVDialog() {
    this.visibleVar = true;

    console.log(this.selectedPatrocinadores);

  }
  showDDialog(id: any) {
    this.visibleDel = true;
    this.IDd = id;
  }

  deleteSelected() {
    this.disableDV = true;

    const deletePromises = this.selectedPatrocinadores.map((patrocinador: any) => {
      return this.service.delete('patrocinador/' + patrocinador.id).toPromise();
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
          this.disableDV = false;
        }, 1000);

      } else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron eliminar algunos registros' });
        this.disableDV = false;
      }

    }).catch((error) => {
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar los registros' });
      this.disableDV = false;
    });
  }

  getOne(id: any) {
    this.visibleE = true;
    console.log(id);
    this.service.get('patrocinador/' + id).subscribe((dato: any) => {

      if (dato.data) {
        this.Formulario2.patchValue({
          id: dato.data.id,
          nombre: dato.data.nombre,
          descripcion: dato.data.descripcion,
          imagen_url: dato.data.imagen_url,
          link: dato.data.link,
          posicion: dato.data.posicion,
          premium: dato.data.premium
        });
      }
    });

  }

  delete() {
    this.disableD = true;

    this.service.delete('patrocinador/' + this.IDd).subscribe((dato: any) => {

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

  update() {
    this.disableU = true;

    this.service.put('patrocinador/' + this.Formulario2.controls['id'].value, this.Formulario2.value).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Actualizado con exito' });
        this.visible = false;
        setTimeout(() => {
          location.reload();
          this.disableU = false;
        }, 750);

      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actializar el registro' });
        this.visible = false;
        this.disableU = false;
      };

    });

  }

  add() {
    this.disableA = true
    this.service.post('patrocinador', this.Formulario.value).subscribe((dato: any) => {

      if (dato.estatus == true) {
        this.message.add({ severity: 'success', summary: 'Exito!', detail: 'Agregado con exito' });
        this.visible = false;
        setTimeout(() => {
          location.reload();
          this.disableA = false;
        }, 750);
      }
      else {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el registro' });
        this.visible = false;
        this.disableA = false;

      };

    });

  }


  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.patrocinadores.length; i++) {
      if (this.patrocinadores[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  filterSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm) {
      this.filteredPatrocinadores = this.patrocinadores.filter((patrocinador: any) =>
        patrocinador.nombre.toLowerCase().includes(searchTerm) ||
        patrocinador.descripcion.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredPatrocinadores = [...this.patrocinadores];
    }
  }

  getAll() {
    this.loading = true;
    this.service.get('patrocinador').subscribe((dato: any) => {
      this.loading = false;

      if (dato.length > 0) {
        this.filteredPatrocinadores = dato;
        this.patrocinadores = dato;
        this.total = dato.length;

      } else {
        this.message.add({ severity: 'warn', summary: 'Ups', detail: 'No hay patrocinadores aún' });
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
