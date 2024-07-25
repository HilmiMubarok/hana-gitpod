import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SettlementTypeComponent } from './settlement-type.component';
import { SettlementTypeDetailComponent } from './settlement-type-detail.component';
import { SettlementTypeUpdateComponent } from './settlement-type-update.component';
import { settlementTypeRoute } from './settlement-type.route';
import { SettlementTypeViewComponent } from './settlement-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(settlementTypeRoute)],
  declarations: [SettlementTypeComponent, SettlementTypeDetailComponent, SettlementTypeUpdateComponent, SettlementTypeViewComponent],
  entryComponents: [SettlementTypeComponent, SettlementTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSettlementTypeModule {}
