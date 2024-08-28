import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { contactMechTypeRoute } from './contact-mech-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(contactMechTypeRoute)],
  declarations: [],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwContactMechTypeModule {}
