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

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    const adminRoutes = ['/admin-dashboard', '/create-incident'];
    const userRoutes = ['/user-dashboard'];

    const isAdminRoute = adminRoutes.some((path) => state.url.startsWith(path));
    const isUserRoute = userRoutes.some((path) => state.url.startsWith(path));

    if (isAdminRoute && !isAdmin) {
      this.router.navigate(['/user-dashboard']);
      return false;
    }

    if (isUserRoute && isAdmin) {
      this.router.navigate(['/admin-dashboard']);
      return false;
    }

    return true;
  }
}
