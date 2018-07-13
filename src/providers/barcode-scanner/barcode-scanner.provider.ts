import { AlertController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { Injectable } from '@angular/core';

@Injectable()
export class BarcodeScannerProvider {

  constructor (private barcodeScanner: BarcodeScanner,
  private alertCtrl: AlertController) { }

  scanBarcode() {
    const retVal$ = this.barcodeScanner.scan()
      .then((barcodeData: BarcodeScanResult) => {
        // this.controllErrorsLayout(false, true, false);

        const scannedBarcode = barcodeData.text;
        this.showAlert(scannedBarcode);
        return scannedBarcode;
      },
        err => {
          console.log(err);
        });

    return retVal$;
  }

  showAlert(scannedBarcode) {
    const alert = this.alertCtrl.create({
      title: 'scannedBarcode',
      subTitle: scannedBarcode,
      buttons: ['OK']
    });
    alert.present();
  }

}
