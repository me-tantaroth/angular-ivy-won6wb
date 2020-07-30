import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SpeckCrudModule } from 'speck-crud';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../shared/shared.module';
import { MoviesRoutingModule } from './movies-routing.module';

import { MoviesComponent } from './movies.component';
import { MovieCrudComponent } from './movie-crud/movie-crud.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieViewComponent } from './movie-view/movie-view.component';

@NgModule({
  declarations: [MoviesComponent, MovieCrudComponent, MovieListComponent, MovieViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule,
    AngularFirestoreModule,
    SpeckCrudModule,
    QuillModule.forRoot(),
    SharedModule,
    MoviesRoutingModule,
  ],
})
export class CapacitacionModule {}
