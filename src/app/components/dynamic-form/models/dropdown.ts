import { FormInputBase } from './input-base';

export class FormDropdown extends FormInputBase<string> {
  override controlType = 'dropdown';
}
