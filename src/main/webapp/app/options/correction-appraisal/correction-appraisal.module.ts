import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { correctionAppraisalRoute } from './correction-appraisal.route';
import { CorrectionAppraisalComponent } from './correction-appraisal.component';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { CorrectionAppraisalEditComponent } from './correction-appraisal-edit.component';

@NgModule({
  imports: [SharedLibsModule, RouterModule.forChild(correctionAppraisalRoute)],
  declarations: [CorrectionAppraisalComponent, CorrectionAppraisalEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CorrectionAppraisalAppModule {}
