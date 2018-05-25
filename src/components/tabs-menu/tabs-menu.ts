import { NavController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { HomePage } from './../../pages/home/home';
import { LoginComponent } from './../../pages/login/login';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tabs-menu',
  templateUrl: 'tabs-menu.html'
})
export class TabsMenuComponent implements OnInit {

  public homepage: any = HomePage;

  constructor(private authProvider: AuthProvider,
    private navCtrl: NavController
  ) {

  }

  async ngOnInit() {
    // let user = await this.getUser();
    // this.redirectUserToCorrespondingPage(user);
  }

  // private getUser() {
  //   let userKey = this.localStorage.loggedUserLocalStorage;

  //   return this.localStorage.getItemFromLocalStorage(userKey)
  // }

  // private redirectUserToCorrespondingPage(user: any) {
  //   if (user) {
  //     let userModules = JSON.parse(user).ListOfActiveModules;

  //     if (userModules != (null && undefined)) {
  //       if (userModules[0] === ModuleConstants.ID_MODULO_SPEDIZIONI_MULTIPLE) {
  //         this.homepage = ShipmentPage;
  //         console.log('test');
  //       }
  //       else {
  //         this.homepage = HomePage;
  //       }
  //     }
  //     else {
  //       this.homepage = HomePage;
  //     }
  //   }
  //   else {
  //     this.logout();
  //   }
  // }

  logout() {
    this.authProvider.logout();

    this.navCtrl.setRoot(LoginComponent);
  }

}
