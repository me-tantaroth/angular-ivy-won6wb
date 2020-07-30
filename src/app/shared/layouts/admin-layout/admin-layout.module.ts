import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';

import { AdminLayoutComponent } from './admin-layout.component';

@NgModule({
  declarations: [AdminLayoutComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [AdminLayoutComponent],
})
export class AdminLayoutModule {}
