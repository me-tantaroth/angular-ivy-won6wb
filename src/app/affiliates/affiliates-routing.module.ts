import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AffiliatesComponent } from './affiliates.component';
import { AffiliateDetailComponent } from './components/affiliate-detail/affiliate-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AffiliatesComponent,
  },
  {
    path: 'detail/:uid',
    component: AffiliateDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AffiliatesRoutingModule {}
