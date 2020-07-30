import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/auth/shared/shared.module';
import { PendindDataRoutingModule } from './pendind-data-routing.module';

import { PendindDataComponent } from './pendind-data.component';

@NgModule({
  declarations: [PendindDataComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PendindDataRoutingModule,
  ],
})
export class PendindDataModule {}
