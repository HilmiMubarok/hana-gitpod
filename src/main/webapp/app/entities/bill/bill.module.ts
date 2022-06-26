import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { BillComponent } from './bill.component';
import { BillDetailComponent } from './bill-detail.component';
import { BillUpdateComponent } from './bill-update.component';
import { billRoute } from './bill.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(billRoute)],
  declarations: [BillComponent, BillDetailComponent, BillUpdateComponent],
  entryComponents: [BillComponent, BillUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBillModule {}
