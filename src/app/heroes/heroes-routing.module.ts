import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

const rutas: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: '**', redirectTo: 'home' }
    ]
  }
];



@NgModule({
  imports: [
    RouterModule.forChild( rutas )
  ],
  exports: [
    RouterModule
  ]
})
export class HeroesRoutingModule { }
