import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(
    private readonly router: Router,
    readonly authStore: AuthStore
  ) {}

  logout(): void {
    this.authStore.logout();
    this.router.navigateByUrl('/login');
  }
}
