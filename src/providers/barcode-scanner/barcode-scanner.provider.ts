import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the BarcodeScannerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BarcodeScannerProvider {

  constructor(public http: HttpClient,
    private barcodeScanner: BarcodeScanner
  ) {
  }

  scanBarcode() {
    const retVal$ = this.barcodeScanner.scan()
      .then((barcodeData: BarcodeScanResult) => {
        // this.controllErrorsLayout(false, true, false);

        const scannedBarcode = barcodeData.text;

        return scannedBarcode;
      },
        err => {
          console.log(err);
        });

    return retVal$;
  }

}
