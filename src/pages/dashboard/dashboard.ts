import { ActivityDetailsPage } from './../activity-details/activity-details';
import { ActivityModel } from './../../models/activity-model';
import { ActivitiesProvider } from './../../providers/activities/activities.provider';
import { GlobalErrorHandlerProvider } from './../../providers/global-error-handler/global-error-handler';
import { BarcodeScannerProvider } from './../../providers/barcode-scanner/barcode-scanner.provider';
import { HomePage } from './../home/home';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage.provider';
import { AuthProvider } from './../../providers/auth/auth.provider';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { User } from '../../models/user-model';
import { LoginComponent } from '../login/login';
import { ShipmentPage } from '../shipment/shipment-page';
import { ActivityPage } from '../activity/activity';
import { Constants } from '../../assets/constants/constants';
import { LavorazioniListPage } from '../lavorazioni-list/lavorazioni-list';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private localStorage: LocalStorageProvider,
    private scannerService: BarcodeScannerProvider,
    private globalErrorHandler: GlobalErrorHandlerProvider,
    private activitiesService: ActivitiesProvider,
    public appCtrl: App) {
  }

  public loggedInUser: User = new User();

  // getRootNav() is deprecated, so we need to use getRootNavById() for redirection on homepage
  private nav;
  public isActiveMultipleShipment = false;
  public isActiveActivityModule = false;
  public isActiveLavorazioniModule = false;

  //Nav Guard which is controlling login page, if user is logged in, he can't enter the login page until he logout
  async ionViewCanEnter() {
    const isAuth = await this.authProvider.isUserAuthentificated();

    return isAuth;
  }

  ngOnInit(): void {
    this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage)
      .then(user => {
        if (user != null) {
          this.loggedInUser = JSON.parse(user);

          //checking if multiple shipment is active
          this.isActiveMultipleShipment = this.checkIfModuleIsActive(this.loggedInUser.ListOfActiveModules, Constants.ID_MODULO_SPEDIZIONI_MULTIPLE);

          //checking if activity is active
          this.isActiveActivityModule = this.checkIfModuleIsActive(this.loggedInUser.ListOfActiveModules, Constants.ID_MODULO_ATTIVITA);

          //checking if lavorazioni module is active
          this.isActiveLavorazioniModule = this.checkIfModuleIsActive(this.loggedInUser.ListOfActiveModules, Constants.ID_MODULO_LAVORAZIONE);
        }
        else {
          this.logout();
        }
      });
  }

  private checkIfModuleIsActive(moduleList: number[], moduleId: number)
  {
    let isActiveModule = false;

    if(moduleList.find(x => x === moduleId))
    {
      isActiveModule = true;
    }

    return isActiveModule;
  }

  async runQRScanner() {
    let qrCode = await this.scannerService.scanBarcode().catch(err => console.log('err' + err));

    if (qrCode != undefined && typeof qrCode == 'string') {
      if (qrCode) {
        const qrAndType = await this.activitiesService.getScannedIdAndType(qrCode);
        const qr = qrAndType.qr;
        const type = qrAndType.scannerType;
        if (type === Constants.ORDER || type === Constants.LAVORAZIONE) {
          this.navigateToActivity(qr, type);
        }
        else {
          this.navigateToActivityDetailsPage(Number(qr));
        }
      }
      else {
        this.globalErrorHandler.showBarcodeErrorAlert();
      }
    }
    else {
      this.globalErrorHandler.showBarcodeErrorAlert();
    }
  }


  logout() {
    this.authProvider.logout();

    // this will remove tabs menu from layout after we logout and redirect to login page
    // this.appCtrl.getRootNav().setRoot(LoginComponent);       -- this method is deprecated, so we should use methods above
    this.nav = this.appCtrl.getRootNavById('n4');
    this.nav.setRoot(LoginComponent);
  }

  navigateToBarcodeScannerPage() {
    this.navCtrl.push(ShipmentPage);
  }

  navigateToActivityDetailsPage(activityId: number) {
    this.navCtrl.push(ActivityDetailsPage, {
      activityId: activityId
    });
  }

  navigateToLavorazioniPage(activityId: number) {
    this.navCtrl.push(LavorazioniListPage);
  }

  navigateToActivity(qrCode, scannerType) {
    if (!qrCode && !scannerType) {
      this.navCtrl.push(ActivityPage);
    }
    else {
      this.navCtrl.push(ActivityPage, {
        qrCode: qrCode,
        scannerType: scannerType
      });
    }
  }

  navigateToImpostazioni() {
    this.navCtrl.push(HomePage);
  }
}
