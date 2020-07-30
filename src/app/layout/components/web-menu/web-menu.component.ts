import { Component, OnInit, Input } from '@angular/core';

import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-layout-web-menu',
  templateUrl: './web-menu.component.html',
  styleUrls: ['./web-menu.component.scss']
})
export class WebMenuComponent implements OnInit {
  @Input() menu: Menu[];

  constructor() { }

  ngOnInit(): void {
  }

}
