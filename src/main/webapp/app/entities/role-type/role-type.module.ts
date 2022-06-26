import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { RoleTypeComponent } from './role-type.component';
import { RoleTypeDetailComponent } from './role-type-detail.component';
import { RoleTypeUpdateComponent } from './role-type-update.component';
import { roleTypeRoute } from './role-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(roleTypeRoute)],
  declarations: [RoleTypeComponent, RoleTypeDetailComponent, RoleTypeUpdateComponent],
  entryComponents: [RoleTypeComponent, RoleTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwRoleTypeModule {}
