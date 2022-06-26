import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { AcctgTransComponent } from './acctg-trans.component';
import { AcctgTransDetailComponent } from './acctg-trans-detail.component';
import { AcctgTransUpdateComponent } from './acctg-trans-update.component';
import { acctgTransRoute } from './acctg-trans.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(acctgTransRoute)],
  declarations: [AcctgTransComponent, AcctgTransDetailComponent, AcctgTransUpdateComponent],
  entryComponents: [AcctgTransComponent, AcctgTransUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAcctgTransModule {}
