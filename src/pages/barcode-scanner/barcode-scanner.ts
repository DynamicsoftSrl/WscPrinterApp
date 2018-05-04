import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ShipmentProvider } from '../../providers/shipment/shipment';
import { ShipmentDetailsModel } from '../../models/shipment-details-model';

@IonicPage()
@Component({
  selector: 'page-barcode-scanner',
  templateUrl: 'barcode-scanner.html',
})
export class BarcodeScannerPage {

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private shipment: ShipmentProvider) {
  }

  public isScanned: boolean = false;
  public model: ShipmentDetailsModel = new ShipmentDetailsModel();

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
        this.isScanned = true;

        let id = res;

        this.shipment.getShipmentDetails(id)
          .then(response => {
            response.subscribe((shipmentDetails: ShipmentDetailsModel) => {
              console.log(shipmentDetails);
              this.model = shipmentDetails;
            })
          })
      })
      .catch(err => {
        this.isScanned = true;

        // let id = '6';
        // this.shipment.getShipmentDetails(id)
        //   .then(response => {
        //     response.subscribe((shipmentDetails: ShipmentDetailsModel) => {
        //       console.log(shipmentDetails);
        //       this.model = shipmentDetails;
        //     })
        //   })
        // console.log(err);
      });
  }
}
