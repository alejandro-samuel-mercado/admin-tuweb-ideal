import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, take, filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.isInitialized$.pipe(
      filter((initialized) => initialized),
      switchMap(() => this.authService.currentUser$),
      take(1),
      map((user) => {
        if (user && user.role === 'ADMIN') {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
