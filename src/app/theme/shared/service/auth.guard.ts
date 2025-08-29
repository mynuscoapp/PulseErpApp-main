import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLogged = sessionStorage.getItem('isLogged') === 'true';
    const userRole = localStorage.getItem('userRole'); // saved during login

    if (!isLogged) {
      this.router.navigate(['/']); // redirect to login page
      return false;
    }

    // ✅ Check roles defined on the route
    const allowedRoles = route.data['roles'] as string[];
    if (allowedRoles && allowedRoles.length > 0) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        this.router.navigate(['/unauthorized']); // redirect if not allowed
        return false;
      }
    }

    return true;
  }
}
