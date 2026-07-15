import { Component, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly form;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly authStore: AuthStore
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);

    this.authService.login({ username: username!, password: password! }).subscribe({
      next: ({ token, user }) => {
        this.authStore.setSession(token, user);
        this.router.navigateByUrl('/posts');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo iniciar sesión');
      },
    });
  }
}
