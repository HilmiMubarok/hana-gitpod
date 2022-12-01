import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { MasterParameterLegalLendingLimitComponent } from './legal-lending-limit-parameter.component';
import { MasterParameterLegalLendingLimitDialogComponent } from './legal-lending-limit-parameter-dialog.component';
import { LEGAL_LENDING_LIMIT_PARAMETER_ROUTE } from './legal-lending-limit-parameter.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(LEGAL_LENDING_LIMIT_PARAMETER_ROUTE)],
  declarations: [MasterParameterLegalLendingLimitComponent, MasterParameterLegalLendingLimitDialogComponent],
  entryComponents: [MasterParameterLegalLendingLimitDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLegalLendingLimitParameterModule {}
