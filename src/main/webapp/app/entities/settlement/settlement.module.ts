import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { SettlementComponent } from './settlement.component';
import { SettlementDetailComponent } from './settlement-detail.component';
import { SettlementUpdateComponent } from './settlement-update.component';
import { settlementRoute } from './settlement.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(settlementRoute)],
  declarations: [SettlementComponent, SettlementDetailComponent, SettlementUpdateComponent],
  entryComponents: [SettlementComponent, SettlementUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSettlementModule {}
