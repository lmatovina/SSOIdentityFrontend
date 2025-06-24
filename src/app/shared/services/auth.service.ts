import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = 'http://localhost:5069/api/auth'; // Promijeni na svoj API endpoint

  constructor(private http: HttpClient) {}

  private decodeJwt(token: string): any {
  if (!token) return null;
  const payload = token.split('.')[1];
  if (!payload) return null;

  // Base64Url decode
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

  createUser(formData: any): Observable<any> {
    return this.http.post(this.baseURL + '/signup', formData);
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseURL + '/login', credentials)
      .pipe(
        tap(response => {
          // Spremi token u localStorage
          sessionStorage.setItem('token', response.token);
        })
      );
  }

  logout() {
    sessionStorage.removeItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
  return !!sessionStorage.getItem('token');
  }

  isAdmin(): boolean {
  const token = sessionStorage.getItem('token');
  if (!token) return false;

  const decoded = this.decodeJwt(token);
  if (!decoded) return false;

  // Provjeri claim za rolu s punim URI-jem
  const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  // roleClaim može biti string ili niz stringova, ovisi kako šalješ JWT
  if (!roleClaim) return false;

  if (Array.isArray(roleClaim)) {
    return roleClaim.includes('Admin');
  } else {
    return roleClaim === 'Admin';
  }
}

}

