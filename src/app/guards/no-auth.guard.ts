/*
import { CanActivateFn } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
*/

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Reemplaza esta lógica con la validación real de tu autenticación
    const usuarioNoRegistrado = false;

    if (!usuarioNoRegistrado) {
      // Si el usuario está autenticado, redirige a otro lugar
      this.router.navigate(['/homepage']);
      return false;
    }
    return true;
  }
}
