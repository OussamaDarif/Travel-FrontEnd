import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.host}/api/contact`;

@Injectable({
  providedIn: 'root'
})

export class ContactsService {

  constructor(private http: HttpClient) { }

  findAllcontacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(baseUrl);
  }

  create(data): Observable<any> {
    return this.http.put(`${baseUrl}/create/`, data);
  }

  delete(id: any): Observable<any>  {
    return this.http.delete(`${baseUrl}/delete/${id}`);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/update/${id}`, data);
  }

}
