import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { contactMechTypeRoute } from './contact-mech-type.route';
import { ContactMechTypeViewComponent } from './contact-mech-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(contactMechTypeRoute)],
  declarations: [ContactMechTypeViewComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwContactMechTypeModule {}
