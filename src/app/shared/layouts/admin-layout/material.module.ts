import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const MatComponents: any[] = [
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatCardModule,
  MatSnackBarModule,
];

@NgModule({
  imports: [...MatComponents],
  exports: [...MatComponents],
})
export class MaterialModule {}
