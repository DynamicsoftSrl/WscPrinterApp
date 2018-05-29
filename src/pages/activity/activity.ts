import { ActivitiesProvider } from './../../providers/activities/activities.provider';
import { BarcodeScannerProvider } from '../../providers/barcode-scanner/barcode-scanner.provider';
import { PopoverComponent } from './../../components/popover/popover';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage implements OnInit {


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public barcodeScanner: BarcodeScannerProvider,
    private activities: ActivitiesProvider) {
  }

  private activeState: number = 0;
  public barcodeNumber: any;

  ionViewDidLoad() {
  }

  async ngOnInit() {
    const response$ = await this.activities.getAllActivities(this.activeState);

    response$.subscribe(activities => {
      console.log(activities);
    });
  }

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

  private async getSelectedFilter(selectedState: number) {
    this.activeState = selectedState;

    const response$ = await this.activities.getAllActivities(this.activeState);

    response$.subscribe(activities => {
      console.log(activities);
    });
  }

  async scan() {
    this.barcodeNumber = await this.barcodeScanner.scanBarcode();
  }

}
