import { GlobalErrorHandlerProvider } from './../../../providers/global-error-handler/global-error-handler';
import { LoadingSpinnerProvider } from './../../../providers/loading-spinner/loading-spinner.provider';
import { User } from './../../../models/user-model';
import { LocalStorageProvider } from './../../../providers/local-storage/local-storage.provider';
import { ActivitiesProvider } from './../../../providers/activities/activities.provider';
import { Component, Input, OnInit } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';
import { OrderRowModel } from '../../../models/order-row-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'info',
  templateUrl: 'info.html'
})
export class InfoComponent implements OnInit {


  constructor(
    private activitiesService: ActivitiesProvider,
    private localStorage: LocalStorageProvider,
    private spinner: LoadingSpinnerProvider,
    private errHandler: GlobalErrorHandlerProvider
  ) {}

  @Input('activityInfo') activityInfo: ActivityModel;

  public orderData: OrderRowModel = new OrderRowModel();

  async ngOnInit() {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();

    const userStr = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);

    const user: User = JSON.parse(userStr);
    const infoData = await this.activitiesService.getInfoPageData(this.activityInfo.IdOrder, user.UserId);

    infoData.subscribe((res: OrderRowModel) => {
      this.orderData = res;
      // hide loading spinner
      this.spinner.hideLoadingSpinner();
    }, 
    (err: HttpErrorResponse) => {
      this.spinner.hideLoadingSpinner();

      // show error notification
      this.errHandler.handleServerError(err);
    });
  }
}