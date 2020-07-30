import { Component } from '@angular/core';
import { MENU_DATA } from '../../constants/menu';

@Component({
  selector: 'app-layout-option-three',
  templateUrl: './option-three.component.html',
  styleUrls: ['./option-three.component.scss']
})
export class OptionThreeComponent {
  menuList: {
    path: string[];
    text: string;
  }[] = MENU_DATA;

  log(data) {
    console.log('LOG', data);
  }
}
