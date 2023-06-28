import { FormInputBase } from './input-base';

export class FormDate extends FormInputBase<string> {
  override controlType = 'date';
}