import { ModuleConstants } from './../../assets/constants/constants';
import { User } from './../../models/user-model';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { BarcodeScannerPage } from '../../pages/barcode-scanner/barcode-scanner';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent implements OnInit {

  @Input('content') content: any;
  public loggedInUser: User = new User();

  private isActiveMultipleShipment: boolean = false;

  constructor(private localStorage: LocalStorageProvider,
    private navCtrl: NavController,
    public menuCtrl: MenuController ) {
  }

  ngOnInit(): void {
    let userKey = this.localStorage.loggedUserLocalStorage;

    this.localStorage.getItemFromLocalStorage(userKey)
      .then(user => {
        this.loggedInUser = JSON.parse(user);
        if (this.loggedInUser.ListOfActiveModules) {
          if (this.loggedInUser.ListOfActiveModules.find(x => x === ModuleConstants.ID_MODULO_SPEDIZIONI_MULTIPLE)) {
            this.isActiveMultipleShipment = true;
          }
          else {
            this.isActiveMultipleShipment = false;
          }
        }
      });
  }

  NavigateToBarcodeScanner() {
    this.menuCtrl.close();
    this.navCtrl.push(BarcodeScannerPage);
  }

}
