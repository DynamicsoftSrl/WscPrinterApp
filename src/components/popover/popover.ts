import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent implements OnInit {

  constructor(
    public viewCtrl: ViewController
  ) {
  }

  public data: number[] = this.viewCtrl.data.allStates;
  public selection: number = this.viewCtrl.data.activeState;

  ngOnInit(): void {
  }

  radioChanged(selectedValue: number) {
    this.selection = selectedValue;

    this.viewCtrl.data.activeState = this.selection;

    this.close();
  }

  close() {
    this.viewCtrl.dismiss(this.selection);
  }

}
