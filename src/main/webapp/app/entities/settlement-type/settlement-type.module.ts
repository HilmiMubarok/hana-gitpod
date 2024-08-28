import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { SettlementTypeComponent } from './settlement-type.component';
import { SettlementTypeDetailComponent } from './settlement-type-detail.component';
import { SettlementTypeUpdateComponent } from './settlement-type-update.component';
import { settlementTypeRoute } from './settlement-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(settlementTypeRoute)],
  declarations: [SettlementTypeComponent, SettlementTypeDetailComponent, SettlementTypeUpdateComponent],
  entryComponents: [SettlementTypeComponent, SettlementTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSettlementTypeModule {}
