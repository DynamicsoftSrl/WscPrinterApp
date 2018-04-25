import { LoginComponent } from './../pages/login/login';
import { AuthProvider } from './../providers/auth/auth';
import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsMenuComponent } from './../components/tabs-menu/tabs-menu';
import { BarcodeScannerPage } from '../pages/barcode-scanner/barcode-scanner';

@Component({
  templateUrl: 'app.html'
})
export class
  MyApp implements OnInit {


  rootPage = BarcodeScannerPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private auth: AuthProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit(): void {
    // this.auth.isUserAuthentificated().then(isAuth => {
    //   if (isAuth) {
    //     this.rootPage = TabsMenuComponent;
    //   }
    //   else {
    //     this.rootPage = LoginComponent;
    //   }
    // })
  }
}
