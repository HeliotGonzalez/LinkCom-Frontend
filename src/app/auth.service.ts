import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private userID: string | null = null;

  constructor() {}

  setUserId(userID: string){
    this.userID = userID;
  }

  // Método para almacenar el token, por ejemplo, después del login
  setToken(token: string): void {
    this.token = token;
  }

  // Método para obtener el token almacenado
  getToken(): string | null {
    return this.token;
  }

  // Método para extraer el UUID del usuario (almacenado en el claim 'sub')
  getUserUUID(): string | null {
    return this.userID;
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!this.token;
  }
}
