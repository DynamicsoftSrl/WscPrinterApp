import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  selector: 'page-barcode-scanner',
  templateUrl: 'barcode-scanner.html',
})
export class BarcodeScannerPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner) {
  }

  public isScanned: boolean = false;

  ionViewDidLoad() {
  }

  public scanBarcode() {
    this.barcodeScanner.scan()
      .then(barcodeData => {
        console.log('Barcode data', barcodeData);
        this.encodeBarcode(barcodeData);
      })
      .catch(err => {
        console.log(err);
        const id = { id: "123" };
        this.encodeBarcode(id);
      });
  }

  encodeBarcode(data) {
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, data)
      .then(res => {
        console.log(res);
        this.isScanned = true;
      })
      .catch(err => {
        this.isScanned = true;

        console.log(err);
      });
  }
}
