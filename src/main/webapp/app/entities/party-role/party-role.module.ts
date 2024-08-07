import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PartyRoleComponent } from './party-role.component';
import { PartyRoleDetailComponent } from './party-role-detail.component';
import { PartyRoleUpdateComponent } from './party-role-update.component';
import { partyRoleRoute } from './party-role.route';
import { PartyRoleViewComponent } from './party-role-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(partyRoleRoute)],
  declarations: [PartyRoleComponent, PartyRoleDetailComponent, PartyRoleUpdateComponent, PartyRoleViewComponent],
  entryComponents: [PartyRoleComponent, PartyRoleUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyRoleModule {}
