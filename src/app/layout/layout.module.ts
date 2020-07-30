import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';

import {
  OptionOneComponent,
  OptionTwoComponent,
  OptionThreeComponent,
  DefaultComponent,
} from './pages';
import { WebMenuComponent, MobileMenuComponent, FooterComponent } from './components';

@NgModule({
  declarations: [
    OptionOneComponent,
    OptionTwoComponent,
    OptionThreeComponent,
    WebMenuComponent,
    MobileMenuComponent,
    DefaultComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [
    OptionOneComponent,
    OptionTwoComponent,
    OptionThreeComponent,
    DefaultComponent,
  ],
})
export class LayoutModule {}
