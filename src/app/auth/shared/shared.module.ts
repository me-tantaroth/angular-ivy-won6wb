import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { UploaderSelectDirective } from './directives/uploader-select.directive';
import { UploaderComponent } from './components/uploader/uploader.component';

@NgModule({
  declarations: [UploaderSelectDirective, UploaderComponent],
  imports: [CommonModule, LayoutModule],
  exports: [LayoutModule, UploaderSelectDirective, UploaderComponent],
})
export class SharedModule {}
