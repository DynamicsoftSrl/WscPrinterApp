import { Component, Input, OnInit } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';

/**
 * Generated class for the JobInfoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'job-info',
  templateUrl: 'job-info.html'
})
export class JobInfoComponent implements OnInit {


  @Input('activityInfo') activityInfo: ActivityModel;

  constructor() {

  }

  ngOnInit(): void {
    console.log(this.activityInfo);
  }
}
