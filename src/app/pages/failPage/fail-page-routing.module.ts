import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailPageComponent } from './fail-page.component';

const routes: Routes = [
  {path:'failResHandler', component: FailPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FailPageRoutingModule { }
