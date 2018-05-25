import { PopoverComponent } from './../../components/popover/popover';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
  }

  private activeState: number = 0;

  presentPopover(myEvent) {
    const data = { 'activeState': this.activeState, 'allStates': [0, 1, 2, 3, 4, 5] };

    const popover = this.popoverCtrl.create(PopoverComponent, data);

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(selectedState => {
      this.getSelectedFilter(selectedState);
    });
  }

  private getSelectedFilter(selectedState: number) {
    this.activeState = selectedState;
  }

}
