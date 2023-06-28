import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private SERVICE_ANNOTATION_URL = '../../assets/mock/actions-annotation.json';

  private annotation$$ = new BehaviorSubject([]);

  annotation$ = this.annotation$$.asObservable();

  constructor(private readonly _httpClient: HttpClient) { }

  getServiceAnnotation() {
    return this._httpClient.get(this.SERVICE_ANNOTATION_URL).pipe(
      map((res: any) => {
        const actionsConfig = res['@graph'].map((item: any) => ({
          id: item['@id'],
          name: item['schema:name'],
          data: item,
        }));

        this.annotation$$.next(actionsConfig);
        return actionsConfig;
      }),
    );
  }

  getRemoteServiceAnnotation(url: string) {
    return this._httpClient.get(url).pipe(
      map((res: any) => {
        const actionsConfig = res['@graph'].map((item: any) => ({
          id: item['@id'],
          name: item['schema:name'],
          data: item,
        }));

        this.annotation$$.next(actionsConfig);

        return actionsConfig;
      }),
      catchError(() => {
        this.annotation$$.next([]);
        return [];
      }),
    );
  }

  getActionAnnotation(id: string) {
    return this.annotation$.pipe(
      map((annotations) => {
        console.log(annotations);
        const actionConfig: any = annotations.find((item: any) => item.id === id);

        if (!actionConfig) {
          throw new Error('Action not found');
        }

        return actionConfig?.data;
      })
    );
  }

  // should be jsonld
  sendAction(url: string, action: any) {
    return this._httpClient.post(url, action).pipe(
      tap(console.log),
    );
  }
}