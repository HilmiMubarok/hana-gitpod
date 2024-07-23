import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { LendingProgramParameterComponent } from './lending-program-parameter.component';
import { LendingProgramParameterDetailComponent } from './lending-program-parameter-detail.component';
import { LendingProgramParameterUpdateComponent } from './lending-program-parameter-update.component';
import { lendingProgramParameterRoute } from './lending-program-parameter.route';
import { LendingProgramParameterDialogComponent } from './lending-program-parameter-dialog.component';
import { LendingProgramParameterViewComponent } from './lending-program-parameter-view.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(lendingProgramParameterRoute)],
  declarations: [
    LendingProgramParameterComponent,
    LendingProgramParameterDetailComponent,
    LendingProgramParameterUpdateComponent,
    LendingProgramParameterDialogComponent,
    LendingProgramParameterViewComponent,
  ],
  entryComponents: [LendingProgramParameterComponent, LendingProgramParameterUpdateComponent, LendingProgramParameterDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLendingProgramParameterModule {}
