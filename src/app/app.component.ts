import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { DeveloperModeService } from './services/developer-mode.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  navItems$: Observable<any> = this._apiService.annotation$;

  isDevMode$ = this._developerModeService.getValue();

  constructor(
    private _apiService: ApiService,
    private _developerModeService: DeveloperModeService,
  ) {
    this._apiService.getServiceAnnotation().subscribe();
  }

  onDevModeChange(event: MatSlideToggleChange): void {
    this._developerModeService.setValue(event.checked);
  }
}
