import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {


  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController) {

  }

  public showSpinner: boolean = true;

  ngOnInit(): void {
    let loginFormData = this.navParams.get('loginFormData');
    console.log(loginFormData);

    this.presentConfirm();
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
