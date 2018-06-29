import { GlobalErrorHandlerProvider } from './../../../providers/global-error-handler/global-error-handler';
import { LoadingSpinnerProvider } from './../../../providers/loading-spinner/loading-spinner.provider';
import { ActivitiesProvider } from './../../../providers/activities/activities.provider';
import { Component, Input, OnInit } from '@angular/core';
import { ActivityModel } from '../../../models/activity-model';
import { TechnicalDataModel } from '../../../models/activity-technical-data-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'job-info',
  templateUrl: 'job-info.html'
})
export class JobInfoComponent implements OnInit {


  @Input('activityInfo') activityInfo: ActivityModel;

  constructor(
    private activitiesProvider: ActivitiesProvider,
    private spinner: LoadingSpinnerProvider,
    private errHandler: GlobalErrorHandlerProvider
  ) {}

  public technicalData: TechnicalDataModel[] = [new TechnicalDataModel()];

  async ngOnInit() {
    // show loading spinner while waiting for response of server
    this.spinner.showLoadingSpinner();
    const technicalData$ = await this.activitiesProvider.getTechnicalData(this.activityInfo.IdOrder, this.activityInfo.Id_Order_Dettail);

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
