import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';

const routes: Routes = [
  {path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: "login", component: LoginComponent},
  {path: '**',redirectTo: 'login'}
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
