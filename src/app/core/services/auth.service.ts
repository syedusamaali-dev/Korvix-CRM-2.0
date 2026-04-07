import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${API_BASE_URL}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      {
        email,
        password
      }
    );
  }

  register(payload: Record<string, unknown>): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, payload);
  }

  getProfile(): Observable<LoginResponse['data']> {
    return this.http.get<{ success: boolean; data: LoginResponse['data'] }>(`${this.apiUrl}/me`)
      .pipe(map(response => response.data));
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
