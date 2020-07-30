import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoviesComponent } from './movies.component';
import { MovieCrudComponent } from './movie-crud/movie-crud.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieViewComponent } from './movie-view/movie-view.component';

const routes: Routes = [
  {
    path: '',
    component: MoviesComponent,
  },
  {
    path: 'manage',
    component: MovieCrudComponent,
  },
  {
    path: 'list',
    component: MovieListComponent,
  },
  {
    path: 'view/:uuid',
    component: MovieViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
