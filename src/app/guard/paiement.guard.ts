import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notificaton.service';
import { SearchbarService } from '../services/search_bar.service';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class PaiementGuard implements CanActivate {

  constructor(
    private router: Router,
    private searchbarService: SearchbarService,
    private notificationService: NotificationService,
    ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let logement_r = this.searchbarService.searchbar_Data.logement_reserver;
    if (logement_r.length != 0)  return true;
    else
      this.notificationService.showNotification('top','right', 'warning', 'Vous devez d\'abord choisir votre hébergement !!');
      this.router.navigate(['/nosLogements']);
      return false;
  }

}
