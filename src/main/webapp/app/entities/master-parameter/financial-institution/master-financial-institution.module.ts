import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { MasterFinancialInstitutionDialogComponent } from './master-financial-institution-dialog.component';
import { MasterFinancialInstitutionComponent } from './master-financial-institution.component';
import { masterFinancialInstitutionRoute } from './master-financial-institution.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(masterFinancialInstitutionRoute)],
  declarations: [MasterFinancialInstitutionComponent, MasterFinancialInstitutionDialogComponent],
  entryComponents: [MasterFinancialInstitutionDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMasterFinancialInstitutionModule {}
