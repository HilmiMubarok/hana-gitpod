import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { MasterCreditAgreementClausalDialogComponent } from './master-credit-agreement-clausal-dialog.component';
import { masterCreditAgreementClausal } from './master-credit-agreement-clausal.route';
import { MasterCreditAgreementClausalComponent } from './master-credit-agreement-clauasal.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(masterCreditAgreementClausal)],
  declarations: [MasterCreditAgreementClausalComponent, MasterCreditAgreementClausalDialogComponent],
  entryComponents: [MasterCreditAgreementClausalDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMasterCreditAgreementClausalModule {}
