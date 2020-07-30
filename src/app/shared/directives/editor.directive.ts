import { Directive, Input, OnInit, AfterViewInit } from '@angular/core';

declare const $: any;

@Directive({
  selector: '[appEditor]',
})
export class EditorDirective implements OnInit, AfterViewInit {
  @Input('appEditor') idEditor: string;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    $(document).ready(() => {
      $(this.idEditor).richText();
    });
  }
}
