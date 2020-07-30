import { Component } from '@angular/core';
import { MENU_DATA } from '../../constants/menu';

@Component({
  selector: 'app-layout-option-two',
  templateUrl: './option-two.component.html',
  styleUrls: ['./option-two.component.scss']
})
export class OptionTwoComponent {
  menu: {
    path: string[];
    text: string;
  }[] = MENU_DATA;
}
