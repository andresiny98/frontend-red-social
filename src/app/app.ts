import { Component, OnInit } from '@angular/core';
import { AuthStore } from './core/store/auth.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(private readonly authStore: AuthStore) {}

  ngOnInit(): void {
    this.authStore.hydrateFromStorage();
  }
}
