import { ActivitiesProvider } from './../../../providers/activities/activities.provider';
import { Component, OnInit, Input } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';
import { ActivitiesViewModel } from '../../../models/activities-view-model';

@Component({
  selector: 'other-tab',
  templateUrl: 'other-tab.html'
})
export class OtherTabComponent implements OnInit {


  constructor(
    private activitiesService: ActivitiesProvider
  ) {
  }

  @Input('activityInfo') activityInfo: ActivityModel;

  public activities: ActivitiesViewModel = new ActivitiesViewModel();

  ngOnInit(): void {
    this.getTabInfo(this.activityInfo.IdOrder, this.activityInfo.Id_Order_Dettail, this.activityInfo.Id_Processo_Lavorazione);
  }

  private async getTabInfo(orderId, lavorazioneId, activityId) {
    const otherTabData$ = await this.activitiesService.getOtherTabData(orderId, lavorazioneId, activityId);

    otherTabData$.subscribe((res: ActivitiesViewModel) => {
      this.activities = res;
    });
  }
}
