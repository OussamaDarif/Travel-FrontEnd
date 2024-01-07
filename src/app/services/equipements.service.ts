import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipement } from '../models/equipement.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.host}/api/equipement`;

@Injectable({
  providedIn: 'root'
})

export class EquipementsService {

  constructor(private http: HttpClient) { }

  findAllcategories(): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(baseUrl);
  }


}
