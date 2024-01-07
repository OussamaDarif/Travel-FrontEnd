import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NosLogementsComponent } from './nos-logements.component';

const routes: Routes = [
  {path:'nosLogements', component: NosLogementsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NosLogementsRoutingModule { }
