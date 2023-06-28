import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormInputBase } from './models/input-base';
import { Subscription } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnChanges, OnDestroy {
  @Input() formFields: FormInputBase<string | number | boolean>[] | null = [];
  @Output() formChanged = new EventEmitter<any>();

  form!: FormGroup;
  private _subscription = new Subscription();

  ngOnChanges(changes: SimpleChanges): void {
    this.toFormGroup(changes.formFields.currentValue);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private toFormGroup(fields: FormInputBase<string | number | boolean>[] | null = []): void {
    const group: Record<string, FormControl> = {};

    (this.formFields ?? []).forEach((field) => {
      group[field.key] = field.required
        ? new FormControl(field.value || '', [
          ...(field.validators ?? []),
          Validators.required,
        ])
        : new FormControl(field.value || '', field.validators);
    });
    this.form = new FormGroup(group);

    this._subscription.add(
      this.form.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
        const result: any = {};
        Object.keys(value).forEach((key) => {
          if (value[key]) {
            result[key] = value[key];

            if (this.formFields?.find((field) => field.key === key)?.type === 'number') {
              result[key] = +value[key];
            }
          }

        });
        console.log(result);
        this.formChanged.emit(result);
      })
    );
  }
}
