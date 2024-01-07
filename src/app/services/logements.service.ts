import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logement } from '../models/logement.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.host}/api/logements`;

@Injectable({
  providedIn: 'root'
})

export class LogementsService {

  constructor(private http: HttpClient) { }

  findAll_logements(): Observable<Logement[]> {
    return this.http.get<Logement[]>(baseUrl);
  }

  findOne(slug: any): Observable<any> {
    return this.http.get(`${baseUrl}/${slug}`);
  }

  updateOne(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/updateOne/${id}`, data);
  }

}
