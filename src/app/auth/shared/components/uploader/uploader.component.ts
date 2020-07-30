import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements OnInit {
  @Input() accept = 'image/*, video/*, audio/*, .pdf';
  @Input() annotation: string;
  @Input() multiple: boolean;
  @Input() image: string;
  @Output() imageChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  selectFile(base64: string) {
    this.selected.emit(base64);
    this.imageChange.emit(base64);
  }
}
