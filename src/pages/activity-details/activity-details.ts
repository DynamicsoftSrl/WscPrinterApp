import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActivityModel } from '../../models/activity-model';


@IonicPage()
@Component({
  selector: 'page-activity-details',
  templateUrl: 'activity-details.html',
})
export class ActivityDetailsPage implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  public details: string = 'info';

  // getting activity details from parent-nav component
  public infoData: ActivityModel = this.navParams.data;

  ngOnInit(): void {
    console.log(this.infoData);
  }

  segmentChanged(ev: any) {
    console.log(ev);
  }

}
