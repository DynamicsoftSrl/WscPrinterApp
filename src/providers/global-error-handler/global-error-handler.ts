import { ConfigProvider } from './../config/config.provider';
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
    private app: App,
    private configProvider: ConfigProvider
  ) { }

  private nav;
  // text for showing alert notification that internet connection is not available
  public title: string = 'Avvertimento!';
  public message: string = 'Si prega di accendere la connessione internet per utilizzare l\'applicazione!';
  public text: string = 'OK';

  // show alert if activity's state is not changed successfully
  handleServerError(err?: HttpErrorResponse) {
    const isConnectedToInternet = this.configProvider.isConnected();
    if (isConnectedToInternet) {
      if (err) {
        // checking if error is about authorization, if it is, we logout a user
        if (err.status === 401) {
          this.showUnauthorizedAlert();
        }
        else {
          this.showServerErrorAlert();
        }
      }
      else {
        this.showServerErrorAlert();
      }
    }
    else {
      this.showNotificationAlert(this.title, this.message, this.text);
    }
  }

  showServerErrorAlert() {
    const isConnectedToInternet = this.configProvider.isConnected();
    if (isConnectedToInternet) {
      const alert = this.alertCtrl.create({
        title: 'Errore imprevisto!',
        subTitle: 'Azione non corretta. Riprova.',
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      this.showNotificationAlert(this.title, this.message, this.text);
    }
  }

  showBarcodeErrorAlert() {
    const isConnectedToInternet = this.configProvider.isConnected();
    if (isConnectedToInternet) {
      const alert = this.alertCtrl.create({
        title: 'Errore imprevisto!',
        subTitle: 'Il barcode scanzionato non è esistente',
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      this.showNotificationAlert(this.title, this.message, this.text);
    }
  }

  showUnauthorizedAlert() {
    const isConnectedToInternet = this.configProvider.isConnected();
    if (isConnectedToInternet) {
      const alert = this.alertCtrl.create({
        title: 'Non hai le autorizzazioni necessarie!',
        subTitle: 'Non hai le autorizzazioni necessarie per accedere!',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.authProvider.logout();
              //redirect to login page and remove tabs menu
              // this.app.getRootNav().push(LoginComponent);
              this.nav = this.app.getRootNavById('n4');
              this.nav.setRoot(LoginComponent);
            }
          }
        ]
      });

      alert.present();
    }
    else {
      this.showNotificationAlert(this.title, this.message, this.text);
    }
  }

  // showing a notification alert with title, message and text sent from a component
  showNotificationAlert(title, message, text) {
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: text
        }]
    });
    alert.present();
  }
}