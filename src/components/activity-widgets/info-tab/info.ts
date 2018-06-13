import { Component, Input, OnInit } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';

@Component({
  selector: 'info',
  templateUrl: 'info.html'
})
export class InfoComponent implements OnInit {


  constructor() {

  }

  @Input('activityInfo') activityInfo: ActivityModel;

  ngOnInit(): void {
    console.log(this.activityInfo);
  }
}
