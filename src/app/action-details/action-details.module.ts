import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';


import { ActionDetailsComponent } from './action-details.component';
import { DynamicFormModule } from '../components/dynamic-form/dynamic-form.module';

const routes = [{
  path: ':actionId',
  component: ActionDetailsComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    DynamicFormModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ActionDetailsComponent],
  exports: [
    RouterModule,
    ActionDetailsComponent,
  ],
  providers: [],
})
export class ActionDetailsModule { }