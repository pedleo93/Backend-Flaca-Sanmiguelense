import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ListaComponent } from './pages/lista/lista.component';
import { GestorPermisosComponent } from './pages/gestor-permisos/gestor-permisos.component';
import { AuthGuard } from './guard/guard.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'lista', component: ListaComponent, canActivate: [AuthGuard]},
      {path: 'permisos', component: GestorPermisosComponent, canActivate: [AuthGuard]},
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
