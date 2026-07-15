import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'posts' },
  { path: 'login', loadChildren: () => import('./features/auth/auth-module').then((m) => m.AuthModule) },
  {
    path: 'posts',
    canActivate: [authGuard],
    loadChildren: () => import('./features/posts/posts-module').then((m) => m.PostsModule),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/profile/profile-module').then((m) => m.ProfileModule),
  },
  { path: '**', redirectTo: 'posts' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
