import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey: string = 'auth_token';
  private userIDKey: string = 'user_id';

  constructor() {}

  // Guarda el ID del usuario en localStorage
  setUserId(userID: string): void {
    localStorage.setItem(this.userIDKey, userID);
  }

  // Obtiene el UUID del usuario desde localStorage
  getUserUUID(): string {
    return localStorage.getItem(this.userIDKey) || '';
  }

  // Almacena el token en localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtiene el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Verifica si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Método para cerrar sesión y eliminar la información
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIDKey);
    this.setToken('auth_token');
    this.setUserId('user_id');
  }
}
