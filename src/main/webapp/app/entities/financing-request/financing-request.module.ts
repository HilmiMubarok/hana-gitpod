import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FinancingRequestComponent } from './financing-request.component';
import { FinancingRequestDetailComponent } from './financing-request-detail.component';
import { FinancingRequestUpdateComponent } from './financing-request-update.component';
import { financingRequestRoute } from './financing-request.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(financingRequestRoute)],
  declarations: [FinancingRequestComponent, FinancingRequestDetailComponent, FinancingRequestUpdateComponent],
  entryComponents: [FinancingRequestComponent, FinancingRequestUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFinancingRequestModule {}
