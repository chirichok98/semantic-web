import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BASE_URL = 'http://localhost:3000';

  private SERVICE_ANNOTATION_URL = '../../assets/mock/actions-annotation.json';

  constructor(private readonly _httpClient: HttpClient) { }

  getServiceAnnotation() {
    return this._httpClient.get(this.SERVICE_ANNOTATION_URL).pipe(
      map((res: any) => {
        const actionsConfig = res['@graph'].map((item: any) => ({
          id: item['@id'],
          name: item['schema:name'],
        }));

        return actionsConfig;
      }),
    );
    // return this._httpClient.get(`${this.BASE_URL}/service-annotation`);
  }

  getActionAnnotation(id: string) {
    return this._httpClient.get(this.SERVICE_ANNOTATION_URL).pipe(
      map((res: any) => {
        const actionConfig = res['@graph'].find((item: any) => item['@id'] === id);

        if (!actionConfig) {
          throw new Error('Action not found');
        }

        return actionConfig;
      }),
    );
    // return this._httpClient.get(`${this.BASE_URL}/action-annotation/${id}`);
  }
}