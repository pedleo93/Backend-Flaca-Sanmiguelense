import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { NavComponent } from '../nav/nav.component';
import { FaqComponent } from './pages/faq/faq.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { PatrocinadoresComponent } from './pages/patrocinadores/patrocinadores.component';
import { ConvocatoriasComponent } from './pages/convocatorias/convocatorias.component';
import { RegistroConvocatoriasComponent } from './pages/registro-convocatorias/registro-convocatorias.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar'
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DatePipe } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    LoginComponent,
    FaqComponent,
    GaleriaComponent,
    AgendaComponent,
    PatrocinadoresComponent,
    ConvocatoriasComponent,
    RegistroConvocatoriasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    DialogModule,
    RadioButtonModule,
    TableModule,
    RatingModule,
    ToastModule,
    DropdownModule,
    InputTextModule,
    TagModule,
    ButtonModule,
    ToolbarModule,
    FileUploadModule,
    InputTextareaModule,
    PanelModule,
    NavComponent,
    CalendarModule,
    ToggleButtonModule,
    DatePipe,
    InputNumberModule,
    CheckboxModule,
    ConfirmDialogModule
  ]
})
export class AuthModule { }
