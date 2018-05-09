import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginComponent } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { FormsModule } from '@angular/forms';
import { AuthProvider } from '../providers/auth/auth';
import { HttpClientModule } from '@angular/common/http';

import { LocalStorageProvider } from '../providers/local-storage/local-storage';

import { IonicStorageModule } from '@ionic/storage';
import { ComponentsModule } from '../components/components.module';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BarcodeScannerPageModule } from '../pages/barcode-scanner/barcode-scanner.module';
import { MappingProvider } from '../providers/mapping/mapping';
import { ApiProvider } from '../providers/api/api';
import { ShipmentProvider } from '../providers/shipment/shipment';
import { LoadingSpinnerProvider } from '../providers/loading-spinner/loading-spinner';

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
    ComponentsModule,
    BarcodeScannerPageModule
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
    LoadingSpinnerProvider
  ]
})
export class AppModule { }