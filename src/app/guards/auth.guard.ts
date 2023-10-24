import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from "../services/auth/auth.service";
import { Auth, onAuthStateChanged } from "@angular/fire/auth";

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const auth = inject(Auth);
  const router: Router = inject(Router);
  return new Promise((resolve, reject) => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        return resolve(true);
      } else {
        router.navigate(['/login']);
        return reject('unAuthorized!');
      }
    }, (err) => {
      reject();
    })
  });
};
