import { Component, OnInit } from '@angular/core';

import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  menu: Menu[] = [
    {
      path: ['/dashboard'],
      type: 'full',
      text: 'beneficios',
    },
    {
      path: ['/dashboard'],
      type: 'full',
      text: 'Documentación Legal',
    },
    {
      path: ['/dashboard'],
      type: 'full',
      text: 'Ingresar',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
