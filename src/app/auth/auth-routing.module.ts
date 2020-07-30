import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { EmailVerifiedGuard } from './shared/email-verified.guard';

import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: '/:username',
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpModule),
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./sign-in/sign-in.module').then((m) => m.SignInModule),
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpModule),
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: 'action',
    loadChildren: () =>
      import('./action/action.module').then((m) => m.ActionModule),
  },
  {
    path: 'email-verify',
    loadChildren: () =>
      import('./email-verify/email-verify.module').then(
        (m) => m.EmailVerifyModule
      ),
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: 'email-verify/:email',
    loadChildren: () =>
      import('./email-verify/email-verify.module').then(
        (m) => m.EmailVerifyModule
      ),
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./change-password/change-password.module').then(
        (m) => m.ChangePasswordModule
      ),
    canActivate: [AngularFireAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
