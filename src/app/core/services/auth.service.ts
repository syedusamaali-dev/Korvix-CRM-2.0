import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface UserSession {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: UserSession;
}

interface RegisterResponse { success: boolean; message: string; data: Omit<UserSession, 'role'>; }

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

  register(payload: { firstName: string; lastName: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, payload);
  }

  getProfile(): Observable<LoginResponse['data']> {
    return this.http.get<{ success: boolean; data: LoginResponse['data'] }>(`${this.apiUrl}/me`)
      .pipe(map(response => response.data));
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveUser(user: UserSession): void { localStorage.setItem('user', JSON.stringify(user)); }

  saveSession(response: LoginResponse): void {
    this.saveToken(response.token);
    this.saveUser(response.data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
