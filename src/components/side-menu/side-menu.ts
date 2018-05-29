import { ShipmentPage } from './../../pages/shipment/shipment-page';
import { ModuleConstants } from './../../assets/constants/constants';
import { User } from './../../models/user-model';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage.provider';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { ActivityPage } from '../../pages/activity/activity';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent implements OnInit {

  @Input('content') content: any;
  public loggedInUser: User = new User();

  public isActiveMultipleShipment: boolean = false;
  public isActiveActivity: boolean = true;

  constructor(private localStorage: LocalStorageProvider,
    private navCtrl: NavController,
    public menuCtrl: MenuController ) {
  }

  ngOnInit(): void {
    const userKey = this.localStorage.loggedUserLocalStorage;

    this.localStorage.getItemFromLocalStorage(userKey)
      .then(user => {
        this.loggedInUser = JSON.parse(user);
        if (this.loggedInUser.ListOfActiveModules) {

          //checking if multiple shipment is active
          if (this.loggedInUser.ListOfActiveModules.find(x => x === ModuleConstants.ID_MODULO_SPEDIZIONI_MULTIPLE)) {
            this.isActiveMultipleShipment = true;
          }
          else {
            this.isActiveMultipleShipment = false;
          }

          //checking if activity is active
          if (this.loggedInUser.ListOfActiveModules.find(x => x === ModuleConstants.ID_MODULO_ATTIVITA)) {
            this.isActiveActivity = true;
          }
          else {
            // this.isActiveActivity = false;
          }
        }
      });
  }

  NavigateToBarcodeScanner() {
    this.menuCtrl.close();
    this.navCtrl.push(ShipmentPage);
  }

  NavigateToActivity() {
    this.menuCtrl.close();
    this.navCtrl.push(ActivityPage);
  }

}
