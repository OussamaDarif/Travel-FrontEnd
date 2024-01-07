import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultHomeComponent } from 'src/app/shared_pages/default-home/default-home.component';
import { DetailsHebergementComponent } from './details-hebergement.component';

const routes: Routes = [
  {path:'detailsHebergement/:slug', component: DetailsHebergementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsHebergementRoutingModule { }
