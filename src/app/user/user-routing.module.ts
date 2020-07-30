import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailVerifiedGuard } from '../auth/shared/email-verified.guard';

import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: ':username',
    component: UserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
