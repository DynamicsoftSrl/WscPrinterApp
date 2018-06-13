import { Component } from '@angular/core';

@Component({
  selector: 'other-tab',
  templateUrl: 'other-tab.html'
})
export class OtherTabComponent {

  text: string;

  constructor() {
    console.log('Hello OtherTabComponent Component');
    this.text = 'Hello Log tab';
  }

}
