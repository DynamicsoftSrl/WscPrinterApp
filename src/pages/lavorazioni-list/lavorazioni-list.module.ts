import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LavorazioniListPage } from './lavorazioni-list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LavorazioniListPage,
  ],
  imports: [
    IonicPageModule.forChild(LavorazioniListPage),
    TranslateModule
  ],
})
export class LavorazioniListPageModule {}
