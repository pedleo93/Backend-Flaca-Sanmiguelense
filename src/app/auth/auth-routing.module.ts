import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guard/guard.guard';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { PatrocinadoresComponent } from './pages/patrocinadores/patrocinadores.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ConvocatoriasComponent } from './pages/convocatorias/convocatorias.component';
import { RegistroConvocatoriasComponent } from './pages/registro-convocatorias/registro-convocatorias.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard]},
      // {path: 'galeria', component: GaleriaComponent, canActivate: [AuthGuard]},
      {path: 'patrocinadores', component: PatrocinadoresComponent, canActivate: [AuthGuard]},
      {path: 'faq', component: FaqComponent, canActivate: [AuthGuard]},
      {path: 'convocatorias', component: ConvocatoriasComponent, canActivate: [AuthGuard]},
      {path: 'registro-convocatorias', component: RegistroConvocatoriasComponent, canActivate: [AuthGuard]},
      {path: '**',redirectTo: 'login'}
    ]
  }
]


@NgModule({
  imports: [
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
