import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Add this
import { Observable } from 'rxjs'; // Add this



@Injectable({
  providedIn: 'root',
})
export class LoginService {

  isAuthenticated: boolean = false;
  constructor(private http: HttpClient) {}

  IsLogedIn() {
    return this.isAuthenticated;
  }

  setLogedIn() {
    this.isAuthenticated = true;
    return this.isAuthenticated;
  }

  resetlogin() {
    this.isAuthenticated = false;
  }
  login(email: string, password: string): Observable<any> {
    // Change the URL to your backend login endpoint
    return this.http.post<any>('http://localhost:3000/login', { email, password });
  }

  verifyEmail(email: string): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>('http://localhost:3000/verify-email', { email });
  }

  updatePassword(email: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>('http://localhost:3000/reset-password', {
      email,
      newPassword,
    });
  }
}