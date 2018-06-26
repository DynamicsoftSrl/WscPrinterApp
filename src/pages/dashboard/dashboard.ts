import { HomePage } from './../home/home';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage.provider';
import { AuthProvider } from './../../providers/auth/auth.provider';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { User } from '../../models/user-model';
import { LoginComponent } from '../login/login';
import { ShipmentPage } from '../shipment/shipment-page';
import { ActivityPage } from '../activity/activity';

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
    public appCtrl: App) {
  }

  public loggedInUser: User = new User();


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
        }
        else {
          this.logout();
        }
      });
  }

  logout() {
    this.authProvider.logout();

    // this will remove tabs menu from layout after we logout and redirect to login page
    this.appCtrl.getRootNav().setRoot(LoginComponent);
  }

  navigateToBarcodeScanner() {
    this.navCtrl.push(ShipmentPage);
  }

  navigateToActivity() {
    this.navCtrl.push(ActivityPage);
  }

  navigateToImpostazioni() {
    this.navCtrl.push(HomePage);
  }
}
