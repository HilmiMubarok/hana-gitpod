import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { MasterLovParameterDialogComponent } from './master-lov-parameter-dialog.component';
import { MasterLovParameterComponent } from './master-lov-parameter.component';
import { MASTER_LOV_PARAMETER } from './master-lov-parameter.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(MASTER_LOV_PARAMETER)],
  declarations: [MasterLovParameterComponent, MasterLovParameterDialogComponent],
  entryComponents: [MasterLovParameterDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMasterLovParameterModule {}
