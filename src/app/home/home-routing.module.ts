import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnderConstructionComponent } from './pages';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: 'en-construccion',
    component: UnderConstructionComponent,
  },
  {
    path: 'home',
    component: HomeComponent
  },
  { path: '', redirectTo: 'en-construccion', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
