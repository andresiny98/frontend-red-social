import { Component } from '@angular/core';
import { AuthStore } from '../../core/store/auth.store';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  constructor(readonly authStore: AuthStore) {}
}
