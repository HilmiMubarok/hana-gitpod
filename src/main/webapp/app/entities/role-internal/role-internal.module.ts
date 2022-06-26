import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { RoleInternalComponent } from './role-internal.component';
import { RoleInternalDetailComponent } from './role-internal-detail.component';
import { RoleInternalUpdateComponent } from './role-internal-update.component';
import { roleInternalRoute } from './role-internal.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(roleInternalRoute)],
  declarations: [RoleInternalComponent, RoleInternalDetailComponent, RoleInternalUpdateComponent],
  entryComponents: [RoleInternalComponent, RoleInternalUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwRoleInternalModule {}
