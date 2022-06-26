import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ReceiptComponent } from './receipt.component';
import { ReceiptDetailComponent } from './receipt-detail.component';
import { ReceiptUpdateComponent } from './receipt-update.component';
import { receiptRoute } from './receipt.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(receiptRoute)],
  declarations: [ReceiptComponent, ReceiptDetailComponent, ReceiptUpdateComponent],
  entryComponents: [ReceiptComponent, ReceiptUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwReceiptModule {}
