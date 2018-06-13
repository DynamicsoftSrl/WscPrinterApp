import { ComponentsModule } from './../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityDetailsPage } from './activity-details';

@NgModule({
  declarations: [
    ActivityDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(ActivityDetailsPage),
    TranslateModule,
    ComponentsModule
  ],
})
export class ActivityDetailsPageModule { }
