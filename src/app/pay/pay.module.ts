import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../auth/shared/shared.module';
import { PayRoutingModule } from './pay-routing.module';

import { PayComponent } from './pay.component';

@NgModule({
  declarations: [PayComponent],
  imports: [CommonModule, SharedModule, PayRoutingModule],
})
export class PayModule {}
