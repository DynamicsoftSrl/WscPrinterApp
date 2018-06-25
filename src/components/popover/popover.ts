import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  constructor(
    public viewCtrl: ViewController
  ) {
  }

  public data: any[] = this.viewCtrl.data.allStates;
  public selection: number = this.viewCtrl.data.activeState;
  public popoverType: string = this.viewCtrl.data.popoverType;

  radioChanged(selectedValue: number) {
    this.selection = selectedValue;

    this.viewCtrl.data.activeState = this.selection;

    this.close();
  }

  close() {
    this.viewCtrl.dismiss(this.selection);
  }

}
