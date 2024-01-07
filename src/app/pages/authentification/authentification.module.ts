import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthentificationRoutingModule } from './authentification-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GoogleAuthComponent } from './google-auth/google-auth.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ResetpasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    GoogleAuthComponent,
    ResetpasswordComponent
  ],
  imports: [
    CommonModule,
    AuthentificationRoutingModule,
    NgxSpinnerModule
  ]
})
export class AuthentificationModule { }
