import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [SharedModule, SharedEntityModule],
  declarations: [],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class losgwAppraisalRoleModule {}
