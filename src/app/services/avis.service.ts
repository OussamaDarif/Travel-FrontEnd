import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.host}/api/avis`;

@Injectable({
  providedIn: 'root'
})

export class AvisService {

  constructor(private http: HttpClient) { }

  create(data): Observable<any> {
    return this.http.post(`${baseUrl}/create/`, data);
  }

}
