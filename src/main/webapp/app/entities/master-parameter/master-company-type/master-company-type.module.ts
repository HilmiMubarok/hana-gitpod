import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { masterCompanyType } from './master-company-type.route';
import { MasterCompanyTypeDialogComponent } from './master-company-type-dialog.component';
import { MasterCompanyTypeComponent } from './master-company-type.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(masterCompanyType)],
  declarations: [MasterCompanyTypeComponent, MasterCompanyTypeDialogComponent],
  entryComponents: [MasterCompanyTypeDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMasterCompanyTypeModule {}
