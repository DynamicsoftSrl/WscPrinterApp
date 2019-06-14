import { GlobalErrorHandlerProvider } from './../../../providers/global-error-handler/global-error-handler';
import { LoadingSpinnerProvider } from './../../../providers/loading-spinner/loading-spinner.provider';
import { ActivitiesProvider } from './../../../providers/activities/activities.provider';
import { Component, Input, OnInit } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';
import { TechnicalDataModel } from '../../../models/activity-technical-data-model';
import { HttpErrorResponse } from '@angular/common/http';
import { LavorazioniModel } from '../../../models/lavorazioni-model';
import { Constants } from '../../../assets/constants/constants';

@Component({
  selector: 'job-info',
  templateUrl: 'job-info.html'
})
export class JobInfoComponent implements OnInit {


  @Input('activityInfo') activityInfo: ActivityModel;
  @Input('parentInfoType') parentInfoType: string;
  @Input('lavInfo') lavInfo: LavorazioniModel;

  constructor(
    private activitiesProvider: ActivitiesProvider,
    private spinner: LoadingSpinnerProvider,
    private errHandler: GlobalErrorHandlerProvider
  ) {}

  public technicalData: TechnicalDataModel[] = [new TechnicalDataModel()];

  async ngOnInit() {
    this.spinner.showLoadingSpinner();
    let technicalData$; 

    if (this.parentInfoType == Constants.LAVORAZIONE) {
      if (this.lavInfo && this.lavInfo.id) {
        technicalData$ = await this.activitiesProvider.getTechnicalData(this.lavInfo.idPrev, this.lavInfo.id);
      }
    }
    else {
      // show loading spinner while waiting for response of server
      technicalData$ = await this.activitiesProvider.getTechnicalData(this.activityInfo.IdOrder, this.activityInfo.Id_Order_Dettail);
    }
    
    technicalData$.subscribe((response: TechnicalDataModel[]) => {
      this.technicalData = response;

      this.spinner.hideLoadingSpinner();
    },
      (err: HttpErrorResponse) => {
        this.spinner.hideLoadingSpinner();

        this.errHandler.handleServerError(err);
      });
  }
}
