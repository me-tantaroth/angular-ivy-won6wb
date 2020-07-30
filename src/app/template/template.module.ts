import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../layout/layout.module';
import { TemplateRoutingModule } from './template-routing.module';

import {
  MainComponent,
  OptionOneComponent,
  OptionTwoComponent,
  OptionThreeComponent,
} from './pages';

@NgModule({
  declarations: [
    MainComponent,
    OptionOneComponent,
    OptionTwoComponent,
    OptionThreeComponent,
  ],
  imports: [CommonModule, LayoutModule, TemplateRoutingModule],
})
export class TemplateModule {}
