import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyGroupComponent } from './party-group.component';
import { PartyGroupDetailComponent } from './party-group-detail.component';
import { PartyGroupUpdateComponent } from './party-group-update.component';
import { partyGroupRoute } from './party-group.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyGroupRoute)],
  declarations: [PartyGroupComponent, PartyGroupDetailComponent, PartyGroupUpdateComponent],
  entryComponents: [PartyGroupComponent, PartyGroupUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyGroupModule {}
