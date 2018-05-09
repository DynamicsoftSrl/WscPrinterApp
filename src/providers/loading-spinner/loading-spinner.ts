import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoadingSpinnerProvider {

  constructor(
    public loadingCtrl: LoadingController) {
  }

  private loading: Loading;

  showLoadingSpinner(contentText?: string, spinnerType?: string) {
    let defaultContent = 'Please wait...';
    let defaultSpinner = 'circles';

    this.loading = this.loadingCtrl.create({
      spinner: spinnerType != null ? spinnerType : defaultSpinner,
      content: contentText != null ? contentText : defaultContent
    });

    this.loading.present();
  }

  hideLoadingSpinner() {
    this.loading.dismiss();
  }

}
