import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { sampleEjsRoute } from './sample-ejs.route';

import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(sampleEjsRoute), ButtonModule, TextBoxModule],
  declarations: [],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSampleEjsModule {}
