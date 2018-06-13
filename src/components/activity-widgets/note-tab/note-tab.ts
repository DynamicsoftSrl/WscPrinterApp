import { Component } from '@angular/core';

@Component({
  selector: 'note-tab',
  templateUrl: 'note-tab.html'
})
export class NoteTabComponent {

  text: string;

  constructor() {
    console.log('Hello NoteTabComponent Component');
    this.text = 'Hello Note tab';
  }

}
