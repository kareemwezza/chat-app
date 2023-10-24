import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn!: boolean;
  subscription!: Subscription;
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.subscription = this.authService.user$.asObservable().subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
