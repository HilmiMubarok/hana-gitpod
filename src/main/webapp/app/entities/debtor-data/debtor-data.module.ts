import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { DebtorDataComponent } from './debtor-data.component';
import { DebtorDataDetailComponent } from './debtor-data-detail.component';
import { DebtorDataUpdateComponent } from './debtor-data-update.component';
import { debtorDataRoute } from './debtor-data.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(debtorDataRoute)],
  declarations: [DebtorDataComponent, DebtorDataDetailComponent, DebtorDataUpdateComponent],
  entryComponents: [DebtorDataComponent, DebtorDataUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwDebtorDataModule {}
