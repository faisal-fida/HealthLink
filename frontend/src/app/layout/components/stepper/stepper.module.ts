import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepperRoutingModule } from './stepper-routing.module';
import { StepperComponent } from './stepper.component';
import { MatStepperModule } from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from 'src/app/architecture/material/material/material.module';

@NgModule({
  declarations: [
    StepperComponent
  ],
  imports: [
    CommonModule,
    StepperRoutingModule,
    ReactiveFormsModule,
    MaterialModule
   
  ]
})
export class StepperModule { }
