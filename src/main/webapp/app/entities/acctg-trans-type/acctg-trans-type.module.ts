import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { AcctgTransTypeComponent } from './acctg-trans-type.component';
import { AcctgTransTypeDetailComponent } from './acctg-trans-type-detail.component';
import { AcctgTransTypeUpdateComponent } from './acctg-trans-type-update.component';
import { acctgTransTypeRoute } from './acctg-trans-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(acctgTransTypeRoute)],
  declarations: [AcctgTransTypeComponent, AcctgTransTypeDetailComponent, AcctgTransTypeUpdateComponent],
  entryComponents: [AcctgTransTypeComponent, AcctgTransTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAcctgTransTypeModule {}
