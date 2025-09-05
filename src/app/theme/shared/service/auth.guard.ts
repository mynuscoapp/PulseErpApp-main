// src/app/theme/shared/service/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NavigationService } from './navigation.service';
import { NavigationItems } from 'src/app/theme/layout/admin/navigation/navigation';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const isLogged = localStorage.getItem('isLogged') === 'true';
    if (!isLogged) return of(this.router.createUrlTree(['/']));

    const role = (localStorage.getItem('userRole') || 'employee').toLowerCase();
    const url = state.url.split('?')[0];

    // figure out which menu this URL corresponds to using NavigationItems
    const menuTitle = this.navigationService.findTitleByUrl(NavigationItems, url);

    // if the url isn't part of the menu, allow access (not a protected menu route)
    if (!menuTitle) return of(true);

    return this.navigationService.getRoleMenuMap().pipe(
      map(roleMap => {
        const allowedTitles = roleMap[role] || [];
        if (allowedTitles.includes(menuTitle)) return true;
        return this.router.createUrlTree(['/unauthorized']);
      }),
      catchError(err => {
        console.error('AuthGuard: failed to fetch role-menu-map', err);
        // choose fail-closed for safety:
        return of(this.router.createUrlTree(['/unauthorized']));
      })
    );
  }
}
