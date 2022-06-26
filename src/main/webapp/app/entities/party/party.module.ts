import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyComponent } from './party.component';
import { PartyDetailComponent } from './party-detail.component';
import { PartyUpdateComponent } from './party-update.component';
import { partyRoute } from './party.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyRoute)],
  declarations: [PartyComponent, PartyDetailComponent, PartyUpdateComponent],
  entryComponents: [PartyComponent, PartyUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyModule {}
