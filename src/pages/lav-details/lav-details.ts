import { Constants } from './../../../www/assets/constants/constants';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user-model';
import { LavorazioniModel } from '../../models/lavorazioni-model';

@IonicPage()
@Component({
  selector: 'page-lav-details',
  templateUrl: 'lav-details.html',
})
export class LavDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public details: string = 'info';
  // tslint:disable-next-line:quotemark
  public parentInfoType: string = Constants.LAVORAZIONE;

  // getting activity details from parent-nav component
  public infoData: LavorazioniModel = this.navParams.data;
  private user: User;

  ionViewDidLoad() {
  }

  // navigate to previous page
  goBack() {
    this.navCtrl.pop();
  }

}
