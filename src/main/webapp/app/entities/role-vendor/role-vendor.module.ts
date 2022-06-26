import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { RoleVendorComponent } from './role-vendor.component';
import { RoleVendorDetailComponent } from './role-vendor-detail.component';
import { RoleVendorUpdateComponent } from './role-vendor-update.component';
import { roleVendorRoute } from './role-vendor.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(roleVendorRoute)],
  declarations: [RoleVendorComponent, RoleVendorDetailComponent, RoleVendorUpdateComponent],
  entryComponents: [RoleVendorComponent, RoleVendorUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwRoleVendorModule {}
