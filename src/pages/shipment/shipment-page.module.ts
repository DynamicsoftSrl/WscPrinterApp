import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ShipmentPage } from './shipment-page';

@NgModule({
  declarations: [
    ShipmentPage
  ],
  imports: [
    IonicPageModule.forChild(ShipmentPage),
    TranslateModule
  ],
})
export class ShipmentModule {}
