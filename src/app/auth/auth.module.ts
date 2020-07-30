import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { SignInModule } from './sign-in/sign-in.module';
import { SignUpModule } from './sign-up/sign-up.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ActionModule } from './action/action.module';

import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    SignInModule,
    SignUpModule,
    ForgotPasswordModule,
    ActionModule
  ],
})
export class AuthModule {}
