import { ActivityModel } from './../../models/activity-model';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage.provider';
import { ActivitiesProvider } from './../../providers/activities/activities.provider';
import { BarcodeScannerProvider } from '../../providers/barcode-scanner/barcode-scanner.provider';
import { PopoverComponent } from './../../components/popover/popover';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { User } from '../../models/user-model';
import { ActivitiesViewModel } from '../../models/activities-view-model';

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
    private activities: ActivitiesProvider,
    private localStorage: LocalStorageProvider) {
  }

  public activeState: number = 0;
  public barcodeNumber: any;
  public activitiesLength: number = 0;
  public userObj: User;

  public period: string = 'today';
  public activitiesList: ActivityModel[];

  async ngOnInit() {
    this.getActivities();
  }

  private async getActivities() {
    const user = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);
    this.userObj = JSON.parse(user);

    const response$ = await this.activities.getAllActivities(0, 10, this.userObj.UserId, this.activeState, this.period);

    response$.subscribe((activities: ActivitiesViewModel) => {
      this.activitiesLength = activities.CountActivities;
      this.activitiesList = activities.Activities;
    });
  }

  presentPopover(myEvent) {
    const data = { 'activeState': this.activeState, 'allStates': [0, 1, 2, 3, 4, 5] };

    const popover = this.popoverCtrl.create(PopoverComponent, data);

    popover.present({
      ev: myEvent
    });

    popover.onWillDismiss(selectedState => {

      if (selectedState != null) {
        this.getSelectedFilter(selectedState);
      }
    });
  }

  private async getSelectedFilter(selectedState: number) {
    //if somebody select state that is already selected, we don't want to send again a request, else get new data
    if (selectedState != this.activeState) {
      this.activeState = selectedState;

      const response$ = await this.activities.getAllActivities(0, 10, this.userObj.UserId, this.activeState, this.period);

      response$.subscribe((activities: ActivitiesViewModel) => {
        this.activitiesLength = activities.CountActivities;

        this.activitiesList = activities.Activities;
      });
    }
  }

  async scan() {
    this.barcodeNumber = await this.barcodeScanner.scanBarcode();
  }

  clicked(item: any) {
    console.log(item);
  }

  // on change of period (today, tommorow, all), send request and get activities list
  segmentChanged(ev) {
    this.period = ev._value;

    this.getActivities();
  }
}
