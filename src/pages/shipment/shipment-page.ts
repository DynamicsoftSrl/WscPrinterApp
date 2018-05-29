import { BarcodeScannerProvider } from '../../providers/barcode-scanner/barcode-scanner.provider';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage.provider';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { LoadingSpinnerProvider } from '../../providers/loading-spinner/loading-spinner.provider';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, App } from 'ionic-angular';
import { ShipmentProvider } from '../../providers/shipment/shipment.provider';
import { ShipmentDetailsModel } from '../../models/shipment-details-model';
import { AlertController } from 'ionic-angular';
import { LoginComponent } from '../login/login';

@IonicPage()
@Component({
  selector: 'shipment',
  templateUrl: 'shipment-page.html'
})
export class ShipmentPage implements OnDestroy {

  constructor(public navCtrl: NavController,
    private shipment: ShipmentProvider,
    private spinner: LoadingSpinnerProvider,
    private authProvider: AuthProvider,
    public alertCtrl: AlertController,
    public app: App,
    private localStorage: LocalStorageProvider,
    private barcodeScanner: BarcodeScannerProvider) {
  }

  public isScanned: boolean = false;
  public scanError: boolean = false;
  public shipmentStatusChanged: boolean = false;
  public changingStateError: boolean = false;
  public hideCourierButton: boolean = false;
  public model: ShipmentDetailsModel = new ShipmentDetailsModel();

  private sub: Subscription = new Subscription();

  //Nav Guard which is controlling login page, if user is logged in, he can't enter the login page until he logout
  async ionViewCanEnter() {
    const isAuth = await this.authProvider.isUserAuthentificated();

    return isAuth;
  }

  async scanBarcode() {
    this.shipmentStatusChanged = false;
    this.changingStateError = false;

    this.spinner.showLoadingSpinner();

    const id = await this.barcodeScanner.scanBarcode();

    if (typeof id == 'string') {
      if (id != (undefined && null && '')) {
        this.getShipmentDetails(id);
      }
      else {
        this.controllErrorsLayout(true, true, true);
      }
    }
    else {
      this.controllErrorsLayout(true, true, true);
    }
  }

  private getShipmentDetails(id: string) {

    this.shipment.getShipmentDetails(id)
      .then(response => {
        const shipmentDetailsSub = response.subscribe((shipmentDetails: ShipmentDetailsModel | null) => {
          if (shipmentDetails && shipmentDetails.RowId != 0) {
            this.model = shipmentDetails;
            if (this.model.StatoSpedizione === 4) {
              this.hideCourierButton = true;
            }
            else {
              this.hideCourierButton = false;
            }

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
          });
      }),
      // tslint:disable-next-line:no-unused-expression
      err => {
        this.controllErrorsLayout(true, true, true);
      };
  }

  //control layout depending on conditions we send to this method
  private controllErrorsLayout(isScanError: boolean, isScanned: boolean, hideSpinner: boolean) {
    this.scanError = isScanError;
    this.isScanned = isScanned;
    if (hideSpinner) {
      this.spinner.hideLoadingSpinner();
    }
  }

  deliverToCourier() {
    this.deliverConfirmationAlert();
  }

  //if user token has expire, show alert and logout
  showAlertAuthorization() {
    const alert = this.alertCtrl.create({
      title: 'Authorization error!',
      subTitle: 'Your token has expired, please login and try again.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.authProvider.logout();
            //redirect to login page and remove tabs menu
            this.app.getRootNav().push(LoginComponent);
          }
        }
      ]
    });

    alert.present();
  }


  deliverConfirmationAlert() {
    const alert = this.alertCtrl.create({
      title: 'Are you sure you want to delivery order?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            this.setShipmentInfo();
          }
        }
      ]
    });

    alert.present();
  }

  async setShipmentInfo() {
    this.spinner.showLoadingSpinner();

    let user = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);
    user = JSON.parse(user);

    let shipmentDetails = new ShipmentDetailsModel();

    shipmentDetails = this.model;

    shipmentDetails.UserId = user.UserId;
    shipmentDetails.UserFirstName = user.Name;
    shipmentDetails.NoteSpedizione = this.model.NoteSpedizione;

    this.shipment.setShipmentDetails(shipmentDetails).then(response => {
      response.subscribe((res: ShipmentDetailsModel) => {
        this.model = res;

        this.shipmentStatusChanged = true;
        this.spinner.hideLoadingSpinner();
      },
        err => {
          this.changingStateError = true;
          this.spinner.hideLoadingSpinner();
        });
    },
      err => {
        this.changingStateError = true;
        this.spinner.hideLoadingSpinner();
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
