import { User } from './../../../models/user-model';
import { LocalStorageProvider } from './../../../providers/local-storage/local-storage.provider';
import { ActivitiesProvider } from './../../../providers/activities/activities.provider';
import { Component, Input, OnInit } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';
import { OrderRowModel } from '../../../models/order-row-model';

@Component({
  selector: 'info',
  templateUrl: 'info.html'
})
export class InfoComponent implements OnInit {


  constructor(
    private activitiesService: ActivitiesProvider,
    private localStorage: LocalStorageProvider
  ) {

  }

  @Input('activityInfo') activityInfo: ActivityModel;

  public orderData: OrderRowModel = new OrderRowModel();

  async ngOnInit() {
    const userStr = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);

    const user: User = JSON.parse(userStr);
    const infoData = await this.activitiesService.getInfoPageData(this.activityInfo.IdOrder, user.UserId);

    infoData.subscribe((res: OrderRowModel) => {
      // console.log(res);
      this.orderData = res;
    });
  }
}