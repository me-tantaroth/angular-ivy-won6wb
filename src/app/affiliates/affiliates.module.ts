import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AffiliatesRoutingModule } from './affiliates-routing.module';
import { AffiliatesComponent } from './affiliates.component';
import { AffiliateViewComponent } from './components/affiliate-view/affiliate-view.component';
import { AffiliateDetailComponent } from './components/affiliate-detail/affiliate-detail.component';


@NgModule({
  declarations: [AffiliatesComponent, AffiliateViewComponent, AffiliateDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    AffiliatesRoutingModule
  ]
})
export class AffiliatesModule { }
