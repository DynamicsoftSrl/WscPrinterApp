import { LavorazioniProvider } from './../../../providers/lavorazioni/lavorazioni.provider';
import { Observable } from 'rxjs/Observable';
import { GlobalErrorHandlerProvider } from './../../../providers/global-error-handler/global-error-handler';
import { LoadingSpinnerProvider } from './../../../providers/loading-spinner/loading-spinner.provider';
import { User } from './../../../models/user-model';
import { LocalStorageProvider } from './../../../providers/local-storage/local-storage.provider';
import { ActivitiesProvider } from './../../../providers/activities/activities.provider';
import { Component, Input, OnInit } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';
import { OrderRowModel } from '../../../models/order-row-model';
import { HttpErrorResponse } from '@angular/common/http';
import { Constants } from '../../../assets/constants/constants';
import { LavorazioniModel } from '../../../models/lavorazioni-model';

@Component({
  selector: 'info',
  templateUrl: 'info.html'
})
export class InfoComponent implements OnInit {


  constructor(
    private activitiesService: ActivitiesProvider,
    private localStorage: LocalStorageProvider,
    private spinner: LoadingSpinnerProvider,
    private errHandler: GlobalErrorHandlerProvider,
    private lavService: LavorazioniProvider
  ) { }

  @Input('activityInfo') activityInfo: ActivityModel;
  @Input('scannedId') scannedId: number;
  @Input('parentInfoType') parentInfoType: string;
  @Input('lavInfo') lavInfo: LavorazioniModel;

  public orderData: OrderRowModel = new OrderRowModel();

  ngOnInit() {
    if (this.parentInfoType == Constants.LAVORAZIONE) {
      if(this.lavInfo && this.lavInfo.id)
      {
        this.getLavInfoData(this.lavInfo.id);
      }
    }
    else {
      this.getActivityInfoData();
    }
  }

  async getLavInfoData(idLav: number) {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();
    const userStr = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);

    const user: User = JSON.parse(userStr);

    if (user) {
      this.lavService.getInfoPageData(idLav, user.UserId).then(x => {
        x.subscribe((order: OrderRowModel) => {
          this.orderData = order;
          this.spinner.hideLoadingSpinner();
        });
      }).catch ((err: HttpErrorResponse) => {
      this.spinner.hideLoadingSpinner();
      // show error notification
      this.errHandler.handleServerError(err);
    });
  }
  }


  async getActivityInfoData() {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();

    const userStr = await this.localStorage.getItemFromLocalStorage(this.localStorage.loggedUserLocalStorage);

    const user: User = JSON.parse(userStr);

    let infoData: Observable<Object>;

    // if we are redirected to this page from scanner commessa page, then we shoud first get orderId and then get all details of order, 
    // else we can immediately call getInfoPageData method
    if (!this.scannedId) {
      infoData = await this.activitiesService.getInfoPageData(this.activityInfo.IdOrder, user.UserId);
    }
    else {
      infoData = await this.activitiesService.getInfoScannedPageData(user.UserId, this.scannedId);
    }

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