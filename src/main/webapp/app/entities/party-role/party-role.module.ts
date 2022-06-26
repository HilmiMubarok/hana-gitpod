import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyRoleComponent } from './party-role.component';
import { PartyRoleDetailComponent } from './party-role-detail.component';
import { PartyRoleUpdateComponent } from './party-role-update.component';
import { partyRoleRoute } from './party-role.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyRoleRoute)],
  declarations: [PartyRoleComponent, PartyRoleDetailComponent, PartyRoleUpdateComponent],
  entryComponents: [PartyRoleComponent, PartyRoleUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyRoleModule {}
