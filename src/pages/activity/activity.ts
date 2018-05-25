import { BarcodeScannerProvider } from './../../providers/barcode-scanner/barcode-scanner';
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
    public viewCtrl: ViewController,
    public barcodeScanner: BarcodeScannerProvider) {
  }

  ionViewDidLoad() {
  }

  private activeState: number = 0;
  public barcodeNumber: any;

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

  async scan() {
    this.barcodeNumber = await this.barcodeScanner.scanBarcode();
  }

}
