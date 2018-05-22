import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu/side-menu';
import { TabsMenuComponent } from './tabs-menu/tabs-menu';

//it must be imported in every module
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations:
		[
			SideMenuComponent,
			TabsMenuComponent,
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
			TabsMenuComponent
		],
	entryComponents:
		[
			SideMenuComponent,
			TabsMenuComponent
		]
})
export class ComponentsModule { }
