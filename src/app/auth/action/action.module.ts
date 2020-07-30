import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ActionRoutingModule } from './action-routing.module';
import { ActionComponent } from './action.component';

@NgModule({
  declarations: [ActionComponent],
  imports: [
    CommonModule,
    SharedModule,
    ActionRoutingModule
  ]
})
export class ActionModule { }
