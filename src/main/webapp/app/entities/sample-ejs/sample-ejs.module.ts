import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { MenuAllModule, SidebarModule, ToolbarAllModule, TreeViewAllModule } from '@syncfusion/ej2-angular-navigations';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { SampleEjsSidebarComponent } from './sample-ejs-sidebar.component';
import { SampleEjsComponent } from './sample-ejs.component';
import { sampleEjsRoute } from './sample-ejs.route';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    RouterModule.forChild(sampleEjsRoute),
    // ej2-dropdown
    DropDownListModule,
    // ej2-textbox
    TextBoxModule,
    // ej2-sidebar
    SidebarModule,
    MenuAllModule,
    TreeViewAllModule,
    ToolbarAllModule,
  ],
  declarations: [SampleEjsComponent, SampleEjsSidebarComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSampleEjsModule {}
