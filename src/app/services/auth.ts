import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isInitializedSubject = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitializedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuth();
  }

  checkAuth(): void {
    this.http.get(`${this.apiUrl}/current_user`, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if (res.user && res.user.role === 'ADMIN') {
          this.currentUserSubject.next(res.user);
        } else {
          this.currentUserSubject.next(null);
        }
        this.isInitializedSubject.next(true);
      },
      error: () => {
        this.currentUserSubject.next(null);
        this.isInitializedSubject.next(true);
      },
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((res: any) => {
        if (res.user && res.user.role === 'ADMIN') {
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout(): void {
    this.http.get(`${this.apiUrl}/logout`, { withCredentials: true }).subscribe(() => {
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    });
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN';
  }
}
