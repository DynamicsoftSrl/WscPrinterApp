import { LavorazioniModel } from './../../../models/lavorazioni-model';
import { GlobalErrorHandlerProvider } from './../../../providers/global-error-handler/global-error-handler';
import { LoadingSpinnerProvider } from './../../../providers/loading-spinner/loading-spinner.provider';
import { ActivitiesProvider } from './../../../providers/activities/activities.provider';
import { Component, OnInit, Input } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';
import { ActivitiesViewModel } from '../../../models/activities-view-model';
import { HttpErrorResponse } from '@angular/common/http';
import { Constants } from '../../../../www/assets/constants/constants';

@Component({
  selector: 'other-tab',
  templateUrl: 'other-tab.html'
})
export class OtherTabComponent implements OnInit {

  constructor(
    private activitiesService: ActivitiesProvider,
    private spinner: LoadingSpinnerProvider,
    private errHandler: GlobalErrorHandlerProvider
  ) {
    this.activitiesService.listenActivityListener().subscribe((data: any) => {
      this.activities.OrderDetailsWorkflow = data;
    });
  }

  @Input('activityInfo') activityInfo: ActivityModel;
  @Input('parentInfoType') parentInfoType: string;
  @Input('lavInfo') lavInfo: LavorazioniModel;
  
  public activities: ActivitiesViewModel = new ActivitiesViewModel();

  ngOnInit(): void {
    if (this.parentInfoType == Constants.LAVORAZIONE) {
      if(this.lavInfo && this.lavInfo.id && this.lavInfo.idPrev)
      {
        this.getTabInfo(this.lavInfo.idPrev, this.lavInfo.id, this.lavInfo.numeroProcessi);
      }
    }
    else {
      this.getTabInfo(this.activityInfo.IdOrder, this.activityInfo.Id_Order_Dettail, this.activityInfo.Id_Processo_Lavorazione);
    }
  }

  private async getTabInfo(orderId, lavorazioneId, activityId) {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();
    const otherTabData$ = await this.activitiesService.getOtherTabData(orderId, lavorazioneId, activityId);

    otherTabData$.subscribe((res: ActivitiesViewModel) => {
      this.activities = res;
      this.spinner.hideLoadingSpinner();
    },
      (err: HttpErrorResponse) => {
        this.spinner.hideLoadingSpinner();

        this.errHandler.handleServerError(err);
      });
  }
}
