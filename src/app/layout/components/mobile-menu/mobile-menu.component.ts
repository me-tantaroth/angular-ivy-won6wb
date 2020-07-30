import { Component, OnInit, Input } from '@angular/core';

import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-layout-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnInit {
  @Input() styleClass: string;
  @Input() menu: Menu[];

  constructor() { }

  ngOnInit(): void {
  }

}
