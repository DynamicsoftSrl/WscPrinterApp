import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu/side-menu';
import { TabsMenuComponent } from './tabs-menu/tabs-menu';

//it must be imported in every module
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverComponent } from './popover/popover';
import { InfoComponent } from './activity-widgets/info-tab/info';
import { NoteTabComponent } from './activity-widgets/note-tab/note-tab';
import { OtherTabComponent } from './activity-widgets/other-tab/other-tab';
import { JobInfoComponent } from './activity-widgets/job-info-tab/job-info';

@NgModule({
	declarations:
		[
			SideMenuComponent,
			TabsMenuComponent,
			PopoverComponent,
			InfoComponent,
			JobInfoComponent,
			NoteTabComponent,
			OtherTabComponent,
		],
	imports:
		[
			CommonModule,
			IonicModule,
			TranslateModule
		],
	exports:
		[
			SideMenuComponent,
			TabsMenuComponent,
			PopoverComponent,
			InfoComponent,
			JobInfoComponent,
			NoteTabComponent,
			OtherTabComponent
		],
	entryComponents:
		[
			SideMenuComponent,
			TabsMenuComponent,
			PopoverComponent
		]
})
export class ComponentsModule { }
