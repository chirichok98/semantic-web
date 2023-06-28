import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormInputBase } from '../models/input-base';

@Component({
  selector: 'app-dynamic-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class DynamicFormInputComponent {
  @Input() field!: FormInputBase<string | number | boolean>;
  @Input() form!: FormGroup;

  hasFieldError(): boolean {
    return false;
  }
}
