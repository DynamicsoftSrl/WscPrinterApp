import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { User } from '../../models/user-model';
import { LavorazioniModel } from '../../models/lavorazioni-model';
import { LoadingSpinnerProvider } from '../../providers/loading-spinner/loading-spinner.provider';
import { BarcodeScannerProvider } from '../../providers/barcode-scanner/barcode-scanner.provider';
import { ActivitiesProvider } from '../../providers/activities/activities.provider';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage.provider';
import { GlobalErrorHandlerProvider } from '../../providers/global-error-handler/global-error-handler';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { LavorazioniViewModel } from '../../models/lavorazioni-view-model';
import { PopoverComponent } from '../../components/popover/popover';
import { LavDetailsPage } from '../lav-details/lav-details';

@IonicPage()
@Component({
  selector: 'page-lavorazioni-list',
  templateUrl: 'lavorazioni-list.html',
})
export class LavorazioniListPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public barcodeScanner: BarcodeScannerProvider,
    private activitiesService: ActivitiesProvider,
    private localStorage: LocalStorageProvider,
    private spinner: LoadingSpinnerProvider,
    private errHandler: GlobalErrorHandlerProvider) {
  }

  public activeState: number = 1;
  public lavorazioniLength: number = 0;
  public userObj: User;
  private counter: number = 0;

  public period: string = 'today';
  public lavorazioniList: LavorazioniModel[];

  // this lifecycle is runned every time we come to this page
  async ionViewWillEnter() {
    let lavorazioni$ = await this.getLavorazioni();

    this.setStartLavorazioni(lavorazioni$);
  }

  private async getLavorazioni(isInfinite?: boolean) {
    if (!isInfinite) {
      this.spinner.showLoadingSpinner();
    }

    const user = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);
    this.userObj = JSON.parse(user);

    const startRows = this.counter * 10;
    const maximumRows = 10;

    const response$ = await this.activitiesService.getAllLavorazioni(startRows, maximumRows, this.userObj.UserId, this.activeState, this.period);

    return response$;
  }

  // seting lavorazioni value when we get first page of any data
  private setStartLavorazioni(lavorazioni$: Observable<Object>) {
    lavorazioni$.subscribe((lavorazioni: LavorazioniViewModel) => {
      this.lavorazioniLength = lavorazioni.CountLavorazioni;
      this.lavorazioniList = lavorazioni.LavorazioniList;
      this.spinner.hideLoadingSpinner();
    },
      (err: HttpErrorResponse) => {
        this.spinner.hideLoadingSpinner();
        this.errHandler.handleServerError(err);
      });
  }

  presentPopover(myEvent) {
    const data = { 'popoverType': 'lavorazioni', 'activeState': this.activeState, 'allStates': [0, 1, 2, 3, 4] };

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

      let lavorazioni$ = await this.getLavorazioni();

      this.setStartLavorazioni(lavorazioni$);
    }
  }

  // loading more acitivities on infinite scroll
  async doInfinite(infiniteScroll) {

    // checking if we should send request - depending on which page we are and how much of data is left, if we have all data, don't send request
    if (this.lavorazioniLength / 10 > this.counter && this.lavorazioniLength / 10 >= 1) {
      this.counter++;

      const isInfinite = true;
      let lavorazioni$ = await this.getLavorazioni(isInfinite);
      this.appendNewLavorazioni(lavorazioni$, infiniteScroll);
    }
    else {
      infiniteScroll.complete();
    }
  }

  // on change of period (today, tommorow, all), send request and get lavorazioni list
  async segmentChanged(ev) {
    this.period = ev._value;
    this.counter = 0;

    const lavorazioni$ = await this.getLavorazioni();

    this.setStartLavorazioni(lavorazioni$);
  }

  // seting lavorazioni value when we get new lavorazioni data, then append it to existing.
  private appendNewLavorazioni(lavorazioni$: Observable<Object>, infiniteScroll: any) {
    lavorazioni$.subscribe((lavorazioni: LavorazioniViewModel) => {
      this.lavorazioniLength = lavorazioni.CountLavorazioni;
      // adding more data to list after scroll
      this.lavorazioniList.push.apply(this.lavorazioniList, lavorazioni.LavorazioniList);

      infiniteScroll.complete();
    },
      (err: HttpErrorResponse) => {
        console.log(err);
        infiniteScroll.complete();
        this.spinner.hideLoadingSpinner();
        this.errHandler.handleServerError(err);
      });
  }

  clicked(item: LavorazioniModel) {
    this.navCtrl.push(LavDetailsPage, item);
  }
}
