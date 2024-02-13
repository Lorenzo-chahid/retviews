import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient, private router: Router) {}
  createUser(user: any): Observable<any> {
    console.log("CREATE USER :: ", user)
    return this.http.post(`${this.baseUrl}/users/`, user);
  }
  

  login(username: string, password: string): Observable<{ access_token: string, user_id: number }> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http.post<{ access_token: string, user_id: number }>(`${this.baseUrl}/token`, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.access_token);
        localStorage.setItem('user_id', res.user_id.toString());  // Stockez l'ID utilisateur dans le localStorage
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
