import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PartyGroupComponent } from './list/party-group.component';
import { PartyGroupDetailComponent } from './detail/party-group-detail.component';
import { PartyGroupUpdateComponent } from './update/party-group-update.component';
import { PartyGroupDeleteDialogComponent } from './delete/party-group-delete-dialog.component';
import { PartyGroupRoutingModule } from './route/party-group-routing.module';

@NgModule({
  imports: [SharedModule, PartyGroupRoutingModule],
  declarations: [PartyGroupComponent, PartyGroupDetailComponent, PartyGroupUpdateComponent, PartyGroupDeleteDialogComponent],
  entryComponents: [PartyGroupDeleteDialogComponent],
})
export class PartyGroupModule {}
