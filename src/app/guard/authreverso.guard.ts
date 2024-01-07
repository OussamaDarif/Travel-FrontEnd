import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token_storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthReversoGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isLoggedIn = !!this.tokenStorageService.getToken();
      if (isLoggedIn)  {
        this.router.navigate(['/']);
        return false;
      }
      else  return true;
  }

}
