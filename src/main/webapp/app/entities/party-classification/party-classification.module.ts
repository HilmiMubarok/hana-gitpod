import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PartyClassificationComponent } from './party-classification.component';
import { PartyClassificationDetailComponent } from './party-classification-detail.component';
import { PartyClassificationUpdateComponent } from './party-classification-update.component';
import { partyClassificationRoute } from './party-classification.route';
import { PartyClassificationAsChildComponent } from './party-classification-as-child.component';
import { PartyClassificationViewComponent } from './party-classification-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(partyClassificationRoute)],
  declarations: [
    PartyClassificationComponent,
    PartyClassificationDetailComponent,
    PartyClassificationUpdateComponent,
    PartyClassificationAsChildComponent,
    PartyClassificationViewComponent,
  ],
  entryComponents: [PartyClassificationComponent, PartyClassificationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyClassificationModule {}
