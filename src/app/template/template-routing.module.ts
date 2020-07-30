import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  MainComponent,
  OptionOneComponent,
  OptionTwoComponent,
  OptionThreeComponent,
} from './pages';

const routes: Routes = [
  {
    path: 'option-one',
    component: OptionOneComponent,
  },
  {
    path: 'option-two',
    component: OptionTwoComponent,
  },
  {
    path: 'option-three',
    component: OptionThreeComponent,
  },
  { path: '', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateRoutingModule {}
