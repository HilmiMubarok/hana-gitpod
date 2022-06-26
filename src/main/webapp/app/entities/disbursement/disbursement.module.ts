import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { DisbursementComponent } from './disbursement.component';
import { DisbursementDetailComponent } from './disbursement-detail.component';
import { DisbursementUpdateComponent } from './disbursement-update.component';
import { disbursementRoute } from './disbursement.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(disbursementRoute)],
  declarations: [DisbursementComponent, DisbursementDetailComponent, DisbursementUpdateComponent],
  entryComponents: [DisbursementComponent, DisbursementUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwDisbursementModule {}
