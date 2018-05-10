import { AuthProvider } from './../../providers/auth/auth';
import { LoadingSpinnerProvider } from './../../providers/loading-spinner/loading-spinner';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ShipmentProvider } from '../../providers/shipment/shipment';
import { ShipmentDetailsModel } from '../../models/shipment-details-model';
import { AlertController } from 'ionic-angular';
import { LoginComponent } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-barcode-scanner',
  templateUrl: 'barcode-scanner.html',
})
export class BarcodeScannerPage implements OnDestroy {

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private shipment: ShipmentProvider,
    private spinner: LoadingSpinnerProvider,
    private authProvider: AuthProvider,
    public alertCtrl: AlertController) {
  }

  public isScanned: boolean = false;
  public scanError: boolean = false;
  public model: ShipmentDetailsModel = new ShipmentDetailsModel();

  private sub: Subscription = new Subscription();

  //Nav Guard which is controlling login page, if user is logged in, he can't enter the login page until he logout
  async ionViewCanEnter() {
    let isAuth = await this.authProvider.isUserAuthentificated()

    return isAuth;
  }

  public scanBarcode() {
    this.spinner.showLoadingSpinner();

    this.barcodeScanner.scan()
      .then(barcodeData => {
        // this.controllErrorsLayout(false, true, false);

        const id = barcodeData.text;

        if (id != '') {
          this.getShipmentDetails(id);
        }
        else {
          this.controllErrorsLayout(true, true, true);
        }
      },
        err => {
          console.log(err);
          this.controllErrorsLayout(true, true, true);
        })
  }

  private getShipmentDetails(id: string) {

    this.shipment.getShipmentDetails(id)
      .then(response => {
        let shipmentDetailsSub = response.subscribe((shipmentDetails: ShipmentDetailsModel | null) => {
          if (shipmentDetails && shipmentDetails.RowId != 0) {
            this.model = shipmentDetails;

            this.controllErrorsLayout(false, true, true);

          }
          else {
            this.controllErrorsLayout(true, true, true);
          }

          this.sub.add(shipmentDetailsSub);
        },
          err => {
            //if user token has expire, show alert and logout
            this.showAlertAuthorization();

            this.controllErrorsLayout(true, true, true);
          })
      }),
      err => {
        this.controllErrorsLayout(true, true, true);
      }
  }

  //control layout depending on conditions we send to this method
  private controllErrorsLayout(isScanError: boolean, isScanned: boolean, hideSpinner: boolean) {
    this.scanError = isScanError;
    this.isScanned = isScanned;
    if (hideSpinner) {
      this.spinner.hideLoadingSpinner();
    }
  }

  showAlertAuthorization() {
    let alert = this.alertCtrl.create({
      title: 'Authorization error!',
      subTitle: 'Your token has expired, please login and try again.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.authProvider.logout();
            this.navCtrl.push(LoginComponent)
          }
        }
      ]
    });
    alert.present();
  }

  deliver() {

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
