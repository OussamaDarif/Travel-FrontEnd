import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultHomeComponent } from 'src/app/shared_pages/default-home/default-home.component';
import { AccueilComponent } from './accueil.component';

const routes: Routes = [
  {path:'', component: DefaultHomeComponent,
  children : [
    {path:'accueil', component: AccueilComponent},
    { path: '*' , redirectTo: 'accueil'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccueilRoutingModule { }
