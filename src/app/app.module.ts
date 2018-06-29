import { DashboardPageModule } from './../pages/dashboard/dashboard.module';
import { ActivityDetailsPageModule } from './../pages/activity-details/activity-details.module';
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
import { ApiProvider } from '../providers/api/api.provider';
import { AuthProvider } from '../providers/auth/auth.provider';
import { BarcodeScannerProvider } from '../providers/barcode-scanner/barcode-scanner.provider';
import { LoadingSpinnerProvider } from '../providers/loading-spinner/loading-spinner.provider';
import { LocalStorageProvider } from '../providers/local-storage/local-storage.provider';
import { MappingProvider } from '../providers/mapping/mapping.provider';
import { ShipmentProvider } from '../providers/shipment/shipment.provider';
import { ActivityPageModule } from './../pages/activity/activity.module';
import { ShipmentModule } from './../pages/shipment/shipment-page.module';
import { MyApp } from './app.component';
import { ActivitiesProvider } from '../providers/activities/activities.provider';
import { GlobalErrorHandlerProvider } from '../providers/global-error-handler/global-error-handler';

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
    ActivityPageModule,
    ActivityDetailsPageModule,
    DashboardPageModule
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
    BarcodeScannerProvider,
    ActivitiesProvider,
    GlobalErrorHandlerProvider
  ],
  exports: [
    //exported because of using of translation service in other modules
    TranslateModule
  ]
})
export class AppModule { }