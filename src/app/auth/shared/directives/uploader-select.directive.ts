import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appUploaderSelect]',
})
export class UploaderSelectDirective {
  @Output() base64: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event.target'])
  onClick(element: HTMLElement) {
    let inputFile: HTMLInputElement;

    if (element.tagName === 'SPAN') {
      inputFile = element.parentElement.querySelector('input[type=file]');
    } else {
      inputFile = element.querySelector('input[type=file]');
    }

    console.log('inputFile', inputFile);
    if (inputFile) {
      inputFile.click();
      inputFile.onchange = (event: Event) => {
        event.stopPropagation();
        event.preventDefault();

        const fileInput: any = event.target;
        const files: FileList = fileInput.files;
        const file: File = files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          if (element.tagName === 'INPUT' || element.tagName === 'SPAN') {
            element = element.parentElement;
          }

          element.style.backgroundImage = `url(${e.target.result})`;

          this.base64.emit(e.target.result as string);
        };

        reader.readAsDataURL(file); // convert to base64 string
      };
    }
  }
}
