import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = `${environment.bitrixStockUrl}/bitrixapiurl`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getConfig(): Observable<any> {
    return this.http.get(this.configUrl);
  }

}