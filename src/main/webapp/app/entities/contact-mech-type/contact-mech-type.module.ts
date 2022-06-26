import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ContactMechTypeComponent } from './contact-mech-type.component';
import { ContactMechTypeDetailComponent } from './contact-mech-type-detail.component';
import { ContactMechTypeUpdateComponent } from './contact-mech-type-update.component';
import { contactMechTypeRoute } from './contact-mech-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(contactMechTypeRoute)],
  declarations: [ContactMechTypeComponent, ContactMechTypeDetailComponent, ContactMechTypeUpdateComponent],
  entryComponents: [ContactMechTypeComponent, ContactMechTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwContactMechTypeModule {}
