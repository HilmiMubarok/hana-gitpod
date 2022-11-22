import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { EmployeeComponent } from './employee.component';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeUpdateComponent } from './employee-update.component';
import { employeeRoute } from './employee.route';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { RoleComponent } from './role/role.component';
import { RoleUpdateComponent } from './role/role-update.component';
import { PopupPositionComponent } from './role/popup-position.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(employeeRoute)],
  declarations: [
    EmployeeComponent,
    EmployeeDetailComponent,
    EmployeeUpdateComponent,
    RoleComponent,
    RoleUpdateComponent,
    PopupPositionComponent,
  ],
  entryComponents: [EmployeeComponent, EmployeeUpdateComponent, RoleComponent, RoleUpdateComponent, PopupPositionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwEmployeeModule {}
