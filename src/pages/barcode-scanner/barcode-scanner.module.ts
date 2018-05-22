import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeScannerPage } from './barcode-scanner';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BarcodeScannerPage
  ],
  imports: [
    IonicPageModule.forChild(BarcodeScannerPage),
    TranslateModule
  ],
})
export class BarcodeScannerPageModule {}
