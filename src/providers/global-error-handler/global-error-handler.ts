import { AuthProvider } from './../auth/auth.provider';
import { AlertController, App } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginComponent } from '../../pages/login/login';

@Injectable()
export class GlobalErrorHandlerProvider {

  constructor(
    private alertCtrl: AlertController,
    private authProvider: AuthProvider,
    private app: App
  ) { }

  // show alert if activity's state is not changed successfully
  handleServerError(err?: HttpErrorResponse) {
    if (err) {
      // checking if error is about authorization, if it is, we logout a user
      if (err.status === 401) {
        this.showUnouthorizedAlert();
      }
      else {
        this.showServerErrorAlert();
      }
    }
    else {
      this.showServerErrorAlert();
    }
  }

  showServerErrorAlert() {
    const alert = this.alertCtrl.create({
      title: 'Some error occured!',
      subTitle: 'Your action is not successfully done. Please try later.',
      buttons: ['OK']
    });
    alert.present();
  }

  showUnouthorizedAlert() {
    const alert = this.alertCtrl.create({
      title: 'Authorization error!',
      subTitle: 'Your token has expired, please login and try again.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.authProvider.logout();
            //redirect to login page and remove tabs menu
            this.app.getRootNav().push(LoginComponent);
          }
        }
      ]
    });

    alert.present();
  }
}