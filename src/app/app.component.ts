import { Subscription } from 'rxjs/Subscription';
import { LoginComponent } from './../pages/login/login';
import { AuthProvider } from '../providers/auth/auth.provider';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsMenuComponent } from './../components/tabs-menu/tabs-menu';

import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';
import { ConfigProvider } from '../providers/config/config.provider';
import { GlobalErrorHandlerProvider } from '../providers/global-error-handler/global-error-handler';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {

  rootPage: any;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private auth: AuthProvider,
    public translate: TranslateService,
    private appVersion: AppVersion,
    private configProvider: ConfigProvider,
    private errorService: GlobalErrorHandlerProvider,
    private network: Network) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('it');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('it');

      if (this.platform.is('mobile')) { //-- Check if device have internet connection only on mobile devices
        // check if phone has internet connection
        const isConnected = this.configProvider.isConnected();
        if (!isConnected) {
          this.errorService.showNotificationAlert(this.errorService.title, this.errorService.message, this.errorService.text);
        }
        else {
          this.getAppVersionNumber();
        }

        this.subscribeToConnectionState();
      }
    });
  }

  private sub: Subscription = new Subscription();

  ngOnInit(): void {
    this.auth.isUserAuthentificated().then(isAuth => {
      if (isAuth) {
        this.rootPage = TabsMenuComponent;
      }
      else {
        this.rootPage = LoginComponent;
      }
    });
  }

  subscribeToConnectionState() {
    // watch for a connection network, if the device lose a internet connection, 
    let disconnectSubscription$ = this.network.onDisconnect().subscribe(() => {
      /* check if phone has internet connection, here we check again if phone is connected to internet because it is possible that user turn of wifi 
         but leave 3g/4g connection, so only if both internet connections are not active, close the app */

      //we need to wait for phone to switch from wi fi to a 3g/4g network, if it is turned on
      setTimeout(() => {
        const isConnected = this.configProvider.isConnected();
        if (!isConnected) {
          this.errorService.showNotificationAlert(this.errorService.title, this.errorService.message, this.errorService.text);
        }
      }, 2000);
    });

    this.sub.add(disconnectSubscription$);
  }

  // checking which is version of this app and comparing it to a last version on google play
  getAppVersionNumber() {
    this.appVersion.getVersionNumber().then(version => {
      this.getIonicAppNewestVersion(version);
    }
    );
  }

  /* get version of app which is active on google play,
     if the user doesn't have a latest update, we are showing an alert and closing application */
  getIonicAppNewestVersion(version: string) {
    this.configProvider.getIonicAppVersion().subscribe(response => {
      if (response && response['latestVersion'] !== version) {
        const title = 'Avvertimento!';
        const message = 'Si prega di aggiornare l\'app per continuare a utilizzare!';
        const text = 'OK';

        this.errorService.showNotificationAlert(title, message, text);
      }
    },
      err => {
        this.errorService.showServerErrorAlert();
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
