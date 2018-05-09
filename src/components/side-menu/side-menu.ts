import { User } from './../../models/user-model';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { Component, Input, OnInit } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { BarcodeScannerPage } from '../../pages/barcode-scanner/barcode-scanner';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent implements OnInit {

  @Input('content') content: any;
  public loggedInUser: User = new User();

  constructor(private localStorage: LocalStorageProvider,
    public menuCtrl: MenuController,
    private navCtrl: NavController) {
  }

  ngOnInit(): void {
    this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage)
      .then(user => {
        this.loggedInUser = JSON.parse(user);
      });
  }

  NavigateToBarcodeScanner() {
    this.navCtrl.push(BarcodeScannerPage);
  }

}
