import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ListaComponent } from './pages/lista/lista.component';
import { GestorPermisosComponent } from './pages/gestor-permisos/gestor-permisos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'registro', component: RegistroComponent},
      {path: 'lista', component: ListaComponent},
      {path: 'permisos', component: GestorPermisosComponent},
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
