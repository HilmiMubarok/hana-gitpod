import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { sampleFormRoute } from './sample-form.route';
import { SampleFormComponent } from './sample-form.component';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { SampleFormContentOneComponent } from './sample-form-content-one.component';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    RouterModule.forChild(sampleFormRoute),
    // ej2-tab
    TabModule,
    // ej2-input
    TextBoxModule,
  ],
  declarations: [SampleFormComponent, SampleFormContentOneComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSampleFormModule {}
