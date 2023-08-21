import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { correctionApplicationRoute } from './correction-application.route';
import { CorrectionApplicationComponent, CorrectionApplicationInfoComponent } from './correction-application.component';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { CorrectionApplicationEditComponent, CorrectionApplicationEditInfoComponent } from './correction-application-edit.component';

@NgModule({
  imports: [SharedLibsModule, RouterModule.forChild(correctionApplicationRoute)],
  declarations: [
    CorrectionApplicationComponent,
    CorrectionApplicationEditComponent,
    CorrectionApplicationInfoComponent,
    CorrectionApplicationEditInfoComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CorrectionApplicationAppModule {}
