import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appCuevanaPlayer]',
})
export class CuevanaPlayerDirective implements OnInit {
  constructor(private elem: ElementRef) {}

  ngOnInit() {
    const elem = this.elem.nativeElement;
    const iFrameWindow = elem.contentWindow;

    console.log('>> elem', iFrameWindow.document);
  }
}
