import { FormInputBase } from './input-base';

export class FormNumber extends FormInputBase<number> {
  override controlType = 'number';
}