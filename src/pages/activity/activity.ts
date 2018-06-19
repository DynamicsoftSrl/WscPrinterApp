import { LoadingSpinnerProvider } from './../../providers/loading-spinner/loading-spinner.provider';
import { ActivityDetailsPage } from './../activity-details/activity-details';
import { ActivityModel } from './../../models/activity-model';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage.provider';
import { ActivitiesProvider } from './../../providers/activities/activities.provider';
import { BarcodeScannerProvider } from '../../providers/barcode-scanner/barcode-scanner.provider';
import { PopoverComponent } from './../../components/popover/popover';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { User } from '../../models/user-model';
import { ActivitiesViewModel } from '../../models/activities-view-model';
import { Observable } from 'rxjs/Observable';

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
    private localStorage: LocalStorageProvider,
    private spinner: LoadingSpinnerProvider) {
  }

  public activeState: number = 0;
  public barcodeNumber: any;
  public activitiesLength: number = 0;
  public userObj: User;
  private counter: number = 0;

  public period: string = 'today';
  public activitiesList: ActivityModel[];

  async ngOnInit() {
    let activities$ = await this.getActivities();

    this.setStartActivities(activities$);
  }

  private async getActivities(isInfinite?: boolean) {
    if (!isInfinite) {
      this.spinner.showLoadingSpinner();
    }

    const user = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);
    this.userObj = JSON.parse(user);

    const startRows = this.counter * 10;
    const maximumRows = 10;

    const response$ = await this.activities.getAllActivities(startRows, maximumRows, this.userObj.UserId, this.activeState, this.period);

    return response$;
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
      this.counter = 0;
      this.activeState = selectedState;

      let activities$ = await this.getActivities();

      this.setStartActivities(activities$);
    }
  }

  async scan() {
    let id = await this.barcodeScanner.scanBarcode();

    // if first character is 0, we should remove it
    if (typeof (id) == 'string') {
      if (id.charAt(0) == '0') {
        this.barcodeNumber = id.slice(1, id.length);
      }
    }
  }

  // loading more acitivities on infinite scroll
  async doInfinite(infiniteScroll) {

    // checking if we should send request - depending on which page we are and how much of data is left, if we have all data, don't send request
    if (this.activitiesLength / 10 > this.counter && this.activitiesLength / 10 >= 1) {
      this.counter++;

      const isInfinite = true;
      let activities$ = await this.getActivities(isInfinite);
      this.appendNewActivities(activities$, infiniteScroll);
    }
    else {
      infiniteScroll.complete();
    }
  }

  clicked(item: any) {
    this.navCtrl.push(ActivityDetailsPage, item);
  }

  // on change of period (today, tommorow, all), send request and get activities list
  async segmentChanged(ev) {
    this.period = ev._value;
    this.counter = 0;

    const activities$ = await this.getActivities();

    this.setStartActivities(activities$);
  }

  // seting activites value when we get first page of any data
  private setStartActivities(activities$: Observable<Object>) {
    activities$.subscribe((activities: ActivitiesViewModel) => {
      this.activitiesLength = activities.CountActivities;
      this.activitiesList = activities.Activities;
      this.spinner.hideLoadingSpinner();
      if(this.activitiesList.length > 0){
        console.log(this.activitiesList[0].Id_Order_Dettail);
      }
    },
      err => {
        console.log(err);
      });
  }

  // seting activites value when we get new activities data, then append it to existing.
  private appendNewActivities(activities$: Observable<Object>, infiniteScroll: any) {
    activities$.subscribe((activities: ActivitiesViewModel) => {
      this.activitiesLength = activities.CountActivities;
      // adding more data to list after scroll
      this.activitiesList.push.apply(this.activitiesList, activities.Activities);

      infiniteScroll.complete();
    },
      err => {
        console.log(err);

        infiniteScroll.complete();
      });
  }
}
