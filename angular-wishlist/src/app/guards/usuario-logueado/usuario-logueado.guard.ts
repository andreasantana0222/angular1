import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate,
  CanLoad, Route, UrlSegment,
  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';



import { AuthService } from "./../../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UsuarioLogueadoGuard implements CanActivate {
  constructor (private authService: AuthService) {}
  canActivate(
    next: ActivatedRouteSnapshot,  
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const isLoggedIn = this.authService.isLoggedIn();
      console.log ('canActivate', isLoggedIn);
      return isLoggedIn;
    return true;
  }

}
