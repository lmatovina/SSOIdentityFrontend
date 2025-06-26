import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}

   canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }

    const expectedRole = route.data['role'] as string | undefined;

    if (expectedRole) {
      if (expectedRole === 'Admin' && !this.authService.isAdmin()) {
        return this.router.createUrlTree(['/main']);
      }
    }

    return true;
  }
}

