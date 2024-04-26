import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignInUpRoutingModule } from './sign-in-up-routing.module';
import { SignInUpComponent } from './sign-in-up.component';

import { MaterialModule } from 'src/app/material/material/material.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    SignInUpComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    SignInUpRoutingModule,
    MaterialModule
  ],
  exports:[SignInUpComponent,LoginComponent]
})

export class SignInUpModule { }