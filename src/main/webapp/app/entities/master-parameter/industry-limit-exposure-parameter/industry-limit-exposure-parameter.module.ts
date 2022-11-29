import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { MasterParameterIndustryLimitExposureDialogComponent } from './industry-limit-exposure-parameter-dialog.component';
import { MasterParameterIndustryLimitExposureComponent } from './industry-limit-exposure-parameter.component';
import { INDUSTRY_LIMIT_EXPOSURE_PARAMETER_ROUTE } from './industry-limit-exposure-parameter.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(INDUSTRY_LIMIT_EXPOSURE_PARAMETER_ROUTE)],
  declarations: [MasterParameterIndustryLimitExposureComponent, MasterParameterIndustryLimitExposureDialogComponent],
  entryComponents: [MasterParameterIndustryLimitExposureDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwIndustryLimitExposureParameterModule {}
