import { ActivityPage } from './activity';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ActivityPage
  ],
  imports: [
    IonicPageModule.forChild(ActivityPage),
    TranslateModule
  ],
})
export class ActivityPageModule {}
