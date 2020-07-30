import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { CuevanaPlayerDirective } from './directives';
import { EditorDirective } from './directives/editor.directive';

@NgModule({
  declarations: [CuevanaPlayerDirective, EditorDirective],
  imports: [CommonModule, MaterialModule, AdminLayoutModule],
  exports: [
    MaterialModule,
    AdminLayoutModule,
    CuevanaPlayerDirective,
    EditorDirective,
  ],
})
export class SharedModule {}
