
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../services/api.service';
import { catchError } from 'rxjs/operators';
import { DeveloperModeService } from '../services/developer-mode.service';
import { FormInputBase } from '../components/dynamic-form/models/input-base';
import { FormTextbox } from '../components/dynamic-form/models/text';
import { FormNumber } from '../components/dynamic-form/models/number';
import { FormDate } from '../components/dynamic-form/models/date';

import * as ace from "ace-builds";
import { InputAction } from './utils/generate-input-action';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.scss']
})
export class ActionDetailsComponent {
  @ViewChild("editor") private editor!: ElementRef<HTMLElement>;
  @ViewChild("resultEditor") private resultEditor!: ElementRef<HTMLElement>;

  id = this._route.snapshot.paramMap.get('actionId');
  isDevMode$ = this._developerModeService.getValue();

  inputForm: FormInputBase<string | number | boolean>[] = [];

  loading$ = of(true);

  error: any = null;
  action: any = null;

  latestValue: any = null;
  resultData: any = null;

  constructor(
    private _route: ActivatedRoute,
    private _apiService: ApiService,
    private _developerModeService: DeveloperModeService,
  ) {

    this._route.paramMap.subscribe((params) => {
      this.id = params.get('actionId');
      this.loading$ = of(true);
      this.error = null;
      this.action = null;

      this.loadAction();
    });
  }

  onFormChanged(event: any) {
    const aceEditor = ace.edit(this.editor.nativeElement);
    this.latestValue = InputAction.getBaseConfig(this.action, event);
    aceEditor.session.setValue(this.latestValue);
  }

  sendRequest() {
    const body = JSON.parse(this.latestValue);

    const url = this.action.target.urlTemplate;

    console.log(body);

    this._apiService.sendAction(url, body).subscribe((data) => {
      this.resultData = data;
      console.log(data);
      this._initResultAceEditor(data);
    });
  }

  private _initAceEditor(): void {
    ace.config.set("fontSize", "14px");
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');

    const aceEditor = ace.edit(this.editor.nativeElement);
    this.latestValue = InputAction.getBaseConfig(this.action);
    aceEditor.session.setValue(this.latestValue);

    aceEditor.setTheme('ace/theme/twilight');
    aceEditor.session.setMode('ace/mode/json');
  }

  private _initResultAceEditor(data: any): void {
    ace.config.set("fontSize", "14px");
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');

    const aceEditor = ace.edit(this.resultEditor.nativeElement);
    aceEditor.session.setValue(JSON.stringify(data, null, 2));

    aceEditor.setTheme('ace/theme/twilight');
    aceEditor.session.setMode('ace/mode/json');
  }

  private loadAction() {
    setTimeout(() => {
      this._apiService.getActionAnnotation(this.id as string).pipe(
        catchError(() => {
          this.error = 'Action not found';

          return of(null);
        }),
      ).subscribe((res: any) => {
        this.loading$ = of(false);

        if (res) {
          this.action = this._mapActionAnnotation(res);
          this.inputForm = this.action.input.properties.map((p: any) => this.getFormInput(p));

          setTimeout(() => {
            this._initAceEditor();
          }, 1000)
        }
      });
    }, 1500);
  }

  private _mapActionAnnotation(actionAnnotation: any) {
    const targetAnnotation = actionAnnotation['schema:target'];
    const target = {
      type: targetAnnotation['@type'].replace('schema:', ''),
      httpMethod: targetAnnotation['schema:httpMethod'],
      contentType: targetAnnotation['schema:contentType'],
      encodingType: targetAnnotation['schema:encodingFormat'],
      urlTemplate: targetAnnotation['schema:urlTemplate']['@id'],
    };

    const inputAnnotation = actionAnnotation['wasa:actionShape']['sh:property'].find((p: any) => p['sh:group']['@id'] === 'wasa:Input');

    const input = {
      path: inputAnnotation['sh:path']['@id'],
      class: inputAnnotation['sh:class']['@id'],
      properties: inputAnnotation['sh:node']['sh:property'].map((p: any) => {
        console.log(p);
        return {
          path: p['sh:path']['@id'],
          datatype: this._mapDataType(p['sh:datatype']['@id']),
          required: p['sh:minCount'] > 0,
        };
      }),
    };

    const outputAnnotation = actionAnnotation['wasa:actionShape']['sh:property'].find((p: any) => p['sh:group']['@id'] === 'wasa:Output');
    const output = {
      path: outputAnnotation['sh:path']['@id'],
      class: outputAnnotation['sh:class']['@id'],
      properties: outputAnnotation['sh:node']['sh:property'].map((p: any) => {
        return {
          path: p['sh:path']['@id'],
          datatype: this._mapDataType(p['sh:datatype']['@id']),
          required: p['sh:minCount'] > 0,
        };
      }),
    };

    return {
      type: actionAnnotation['@type'],
      name: actionAnnotation['schema:name'],
      description: actionAnnotation['schema:description'],
      actionStatus: actionAnnotation['schema:actionStatus']['@id'],
      target,
      input,
      output,
    };
  }

  private _mapDataType(datatype: string) {
    switch (datatype) {
      case 'xsd:integer':
      case 'xsd:double':
        return 'Number';

      case 'xsd:date':
        return 'Date';

      case 'xsd:string':
      default:
        return 'Text';
    }
  }

  private getFormInput(config: any) {
    const { required, datatype, path } = config ?? {};

    const result = { required, key: path, label: path };

    switch (datatype) {
      case 'Number':
        return new FormNumber({
          ...result,
          type: 'number',
        });
      case 'Date':
        return new FormDate({
          ...result,
          type: 'date',
        });
      case 'Text':
      default:
        return new FormTextbox({
          ...result,
          type: 'text',
        });
    }
  }
}