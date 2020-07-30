import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LayoutModule } from '../layout/layout.module';
import { HomeRoutingModule } from './home-routing.module';

import { UnderConstructionComponent } from './pages';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [UnderConstructionComponent, HomeComponent],
  imports: [CommonModule, SharedModule, LayoutModule, HomeRoutingModule],
})
export class HomeModule {}
