import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
//ngx translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ComponentsModule } from '../components/components.module';
import { HomePage } from '../pages/home/home';
import { LoginComponent } from '../pages/login/login';
import { ApiProvider } from '../providers/api/api';
import { AuthProvider } from '../providers/auth/auth';
import { BarcodeScannerProvider } from '../providers/barcode-scanner/barcode-scanner';
import { LoadingSpinnerProvider } from '../providers/loading-spinner/loading-spinner';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { MappingProvider } from '../providers/mapping/mapping';
import { ShipmentProvider } from '../providers/shipment/shipment';
import { ActivityPageModule } from './../pages/activity/activity.module';
import { ShipmentModule } from './../pages/shipment/shipment-page.module';
import { MyApp } from './app.component';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    LoginComponent,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ComponentsModule,
    ShipmentModule,
    ActivityPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginComponent,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    HttpClientModule,
    MappingProvider,
    LocalStorageProvider,
    BarcodeScanner,
    ApiProvider,
    ShipmentProvider,
    LoadingSpinnerProvider,
    BarcodeScannerProvider
  ],
  exports: [
    //exported because of using of translation service in other modules
    TranslateModule
  ]
})
export class AppModule { }