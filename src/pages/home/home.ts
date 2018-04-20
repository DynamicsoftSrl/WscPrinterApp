import { LoginComponent } from './../login/login';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {


  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private authProvider: AuthProvider) {
  }

  public showSpinner: boolean = true;

  ngOnInit(): void {
    let UserDetails = this.navParams.get('loginFormData');
    console.log(UserDetails);

    this.presentConfirm();
  }

  logout() {
    this.authProvider.logout();

    this.navCtrl.push(LoginComponent)
  }

  showBubbles() {
    this.showSpinner = !this.showSpinner;
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to buy this book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buy',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }
}
