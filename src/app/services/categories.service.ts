import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.host}/api/category`;

@Injectable({
  providedIn: 'root'
})

export class CategoriesService {

  constructor(private http: HttpClient) { }

  categories_aggregate(): Observable<any> {
    return this.http.get(`${baseUrl}/aggregate/`);
  }

}
