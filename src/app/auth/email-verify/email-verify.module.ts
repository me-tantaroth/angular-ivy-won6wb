import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EmailVerifyRoutingModule } from './email-verify-routing.module';

import { EmailVerifyComponent } from './email-verify.component';

@NgModule({
  declarations: [EmailVerifyComponent],
  imports: [
    CommonModule,
    SharedModule,
    EmailVerifyRoutingModule
  ]
})
export class EmailVerifyModule { }
