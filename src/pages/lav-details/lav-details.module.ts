import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LavDetailsPage } from './lav-details';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    LavDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LavDetailsPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class LavDetailsPageModule {}
