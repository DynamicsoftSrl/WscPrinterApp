import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from './../home/home';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent {

  constructor(public navCtrl: NavController) {
  }
  
  goToHomepage()
  {
    this.navCtrl.push(HomePage);
  }
}
