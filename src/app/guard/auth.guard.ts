import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const isAdminRoute = state.url.includes('admin-dashboard');

    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    if (isAdminRoute && !isAdmin) {
      this.router.navigate(['/user-dashboard']);
      return false;
    }

    return true; // Access granted
  }
}
