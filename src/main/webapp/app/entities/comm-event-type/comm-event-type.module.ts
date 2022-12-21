import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { commEventTypeRoute } from './comm-event-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(commEventTypeRoute)],
  declarations: [],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCommEventTypeModule {}
