
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  baseUrlControl = new FormControl('http://localhost:9000');

  constructor(private _apiService: ApiService) { }

  loadRemoteConfig() {
    this._apiService.getRemoteServiceAnnotation(this.baseUrlControl.value ?? '').subscribe();
  }

  loadLocalConfig() {
    this._apiService.getServiceAnnotation().subscribe();
  }
}