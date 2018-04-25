import { NavController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { HomePage } from './../../pages/home/home';
import { LoginComponent } from './../../pages/login/login';
import { Component } from '@angular/core';

@Component({
  selector: 'tabs-menu',
  templateUrl: 'tabs-menu.html'
})
export class TabsMenuComponent {

  public homepage = HomePage;

  constructor(private authProvider: AuthProvider,
  private navCtrl: NavController) {

  }

  logout() {
    this.authProvider.logout();

    this.navCtrl.setRoot(LoginComponent)
  }

}
