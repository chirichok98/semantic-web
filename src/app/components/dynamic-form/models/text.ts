import { FormInputBase } from './input-base';

export class FormTextbox extends FormInputBase<string> {
  override controlType = 'text';
}