import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { MenuAllModule, SidebarModule, ToolbarAllModule, TreeViewAllModule } from '@syncfusion/ej2-angular-navigations';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { SampleEjsComponent } from './sample-ejs.component';
import { sampleEjsRoute } from './sample-ejs.route';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(sampleEjsRoute)],
  declarations: [SampleEjsComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSampleEjsModule {}
