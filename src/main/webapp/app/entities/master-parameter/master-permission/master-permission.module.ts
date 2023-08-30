import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { MasterPermissionAddComponent } from './master-permission-add.component';
import { MasterPermissionComponent } from './master-permission.component';
import { MASTER_PERMISSION } from './master-permission.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(MASTER_PERMISSION)],
  declarations: [MasterPermissionComponent, MasterPermissionAddComponent],
  entryComponents: [MasterPermissionAddComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMasterPermissionModule {}
