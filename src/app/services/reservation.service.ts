import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.host}/api/reservation`;

@Injectable({
  providedIn: 'root'
})

export class ReservationsService {

  constructor(private http: HttpClient) { }

  findAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(baseUrl);
  }

  findSingleReservations(oid): Observable<any> {
    return this.http.get<any>(`${baseUrl}/single-reservation/${oid}`);
  }

  create(data): Observable<any> {
    return this.http.put(`${baseUrl}/create/`, data);
  }

  delete(id: any): Observable<any>  {
    return this.http.delete(`${baseUrl}/delete/${id}`);
  }

  sendEmail(data) {
    return this.http.post(`${baseUrl}/sendmail/`, data);
  }

}
