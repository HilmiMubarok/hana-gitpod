import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyTypeComponent } from './party-type.component';
import { PartyTypeDetailComponent } from './party-type-detail.component';
import { PartyTypeUpdateComponent } from './party-type-update.component';
import { partyTypeRoute } from './party-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyTypeRoute)],
  declarations: [PartyTypeComponent, PartyTypeDetailComponent, PartyTypeUpdateComponent],
  entryComponents: [PartyTypeComponent, PartyTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyTypeModule {}
