import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private afAuth: Auth = inject(Auth);
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private router: Router) {
    onAuthStateChanged(this.afAuth, (user) => {
      this.user$.next(user);
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email.trim(), password.trim());
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.afAuth, email.trim(), password.trim())
  }

  logout() {
    return signOut(this.afAuth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  get userId() {
    return this.afAuth.currentUser?.uid;
  }

}
