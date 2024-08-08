import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyClassificationComponent } from './party-classification.component';
import { PartyClassificationDetailComponent } from './party-classification-detail.component';
import { PartyClassificationUpdateComponent } from './party-classification-update.component';
import { partyClassificationRoute } from './party-classification.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyClassificationRoute)],
  declarations: [PartyClassificationComponent, PartyClassificationDetailComponent, PartyClassificationUpdateComponent],
  entryComponents: [PartyClassificationComponent, PartyClassificationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyClassificationModule {}
