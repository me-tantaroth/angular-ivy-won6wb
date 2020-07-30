import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { EmailVerifiedGuard } from './auth/shared/email-verified.guard';
import { CapacitacionModule } from './capacitacion/capacitacion.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'template',
    loadChildren: () =>
      import('./template/template.module').then((m) => m.TemplateModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'usuario',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'lider',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'affiliates',
    loadChildren: () =>
      import('./affiliates/affiliates.module').then((m) => m.AffiliatesModule),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  {
    path: 'pending-data',
    loadChildren: () =>
      import('./pendind-data/pendind-data.module').then(
        (m) => m.PendindDataModule
      ),
    canActivate: [AngularFireAuthGuard],
  },
  {
    path: 'pay',
    loadChildren: () => import('./pay/pay.module').then((m) => m.PayModule),
    canActivate: [AngularFireAuthGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  {
    path: 'movies',
    loadChildren: () =>
      import('./movies/movies.module').then((m) => m.MoviesModule),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  {
    path: 'materials',
    loadChildren: () =>
      import('./capacitacion/capacitacion.module').then(
        (m) => m.CapacitacionModule
      ),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  {
    path: 'books',
    loadChildren: () =>
      import('./books/books.module').then((m) => m.BooksModule),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  {
    path: 'level-school',
    loadChildren: () =>
      import('./crud-level-school/level-school.module').then(
        (m) => m.LevelSchoolModule
      ),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  {
    path: 'document-type',
    loadChildren: () =>
      import('./crud-document-types/document-types.module').then(
        (m) => m.DocumentTypesModule
      ),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  {
    path: 'genders',
    loadChildren: () =>
      import('./crud-genders/genders.module').then(
        (m) => m.GendersModule
      ),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  {
    path: 'countries',
    loadChildren: () =>
      import('./crud-countries/countries.module').then(
        (m) => m.CountriesModule
      ),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  {
    path: 'cities',
    loadChildren: () =>
      import('./crud-cities/cities.module').then(
        (m) => m.CitiesModule
      ),
    canActivate: [EmailVerifiedGuard, AngularFireAuthGuard],
  },
  // { path: 'login', redirectTo: '/auth/sign-in', pathMatch: 'full' },
  // { path: 'register', redirectTo: '/auth/sign-up', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/sign-in', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
