import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { User } from './../../models/user-model';
import { LoginComponent } from './../login/login';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {


  constructor(public navCtrl: NavController,
    private authProvider: AuthProvider,
    private localStorage: LocalStorageProvider) {
  }

  public showSpinner: boolean = true;

  public loggedInUser: User = new User();


  //Nav Guard which is controlling login page, if user is logged in, he can't enter the login page until he logout
  ionViewCanEnter() {
    let isAuth = this.authProvider.isUserAuthentificated().then(userIsAuthentificated => {
      return userIsAuthentificated;
    });

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

    this.navCtrl.push(LoginComponent)
  }
}
