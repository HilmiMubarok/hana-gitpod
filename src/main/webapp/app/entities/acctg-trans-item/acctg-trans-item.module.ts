import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { AcctgTransItemComponent } from './acctg-trans-item.component';
import { AcctgTransItemDetailComponent } from './acctg-trans-item-detail.component';
import { AcctgTransItemUpdateComponent } from './acctg-trans-item-update.component';
import { acctgTransItemRoute } from './acctg-trans-item.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(acctgTransItemRoute)],
  declarations: [AcctgTransItemComponent, AcctgTransItemDetailComponent, AcctgTransItemUpdateComponent],
  entryComponents: [AcctgTransItemComponent, AcctgTransItemUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAcctgTransItemModule {}
