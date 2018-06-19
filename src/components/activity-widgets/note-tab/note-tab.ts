import { Component } from '@angular/core';

@Component({
  selector: 'note-tab',
  templateUrl: 'note-tab.html'
})
export class NoteTabComponent {

  public orderNotes;

  constructor() {
    console.log('Hello NoteTabComponent Component');
    this.orderNotes = 'Hello Note tab';
  }

}
