import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DeveloperModeService {
  private devMode$$ = new BehaviorSubject<boolean>(false);

  public setValue(isDevMode: boolean) {
    this.devMode$$.next(isDevMode);
  }

  public getValue(): Observable<boolean> {
    return this.devMode$$.asObservable();
  }
}