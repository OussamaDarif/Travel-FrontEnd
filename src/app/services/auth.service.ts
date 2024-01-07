import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const AUTH_API = `${environment.host}/api/auth/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      email,
      password
    }, httpOptions);
  }

  register(email: string, fullname: string, password: string, phone: number): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      email,
      fullname,
      password,
      phone
    }, httpOptions);
  }

  google_login(email: string, fullname: string, idclient:string): Observable<any> {
    return this.http.post(AUTH_API + 'google_signin', {
      email,
      fullname,
      idclient,
    }, httpOptions);
  }

  emailCheck(email: string): Observable<any> {
    return this.http.post(AUTH_API + 'emailVerification', {
      email
    }, httpOptions);
  }


  sendEmail(user) {
    return this.http.post(AUTH_API + 'sendMailVerif', user, httpOptions);
  }

  changePwdEmail(data) {
    return this.http.post(AUTH_API + 'forgotPwdMail', data, httpOptions);
  }

  resetPassword(data) {
    return this.http.post(AUTH_API + 'resetPassword', data, httpOptions);
  }


}
