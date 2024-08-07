import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyIdentificationComponent } from './party-identification.component';
import { PartyIdentificationDetailComponent } from './party-identification-detail.component';
import { PartyIdentificationUpdateComponent } from './party-identification-update.component';
import { partyIdentificationRoute } from './party-identification.route';
import { PartyIdentificationAsListComponent } from './party-identification-as-list.component';
import { PartyIdentificationViewComponent } from './party-identification-view.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyIdentificationRoute)],
  declarations: [
    PartyIdentificationComponent,
    PartyIdentificationDetailComponent,
    PartyIdentificationUpdateComponent,
    PartyIdentificationAsListComponent,
    PartyIdentificationViewComponent,
  ],
  entryComponents: [PartyIdentificationComponent, PartyIdentificationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyIdentificationModule {}
