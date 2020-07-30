import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendindDataComponent } from './pendind-data.component';

const routes: Routes = [
  {
    path: '',
    component: PendindDataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendindDataRoutingModule {}
