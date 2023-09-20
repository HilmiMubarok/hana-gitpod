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
import { DelegationAppraisalComponent } from './delegation-appraisal.component';
import { DelegationApplicationComponent } from './delegation-application.component';
import { DialogDelegationAppraisalComponent } from './dialog-delegation/dialog-delegation-appraisal.component';
import { DialogDelegationApplicationComponent } from './dialog-delegation/dialog-delegation-application.component';
import { LosgwMiscellaneousModule } from 'app/miscellaneous/miscellaneous.module';
import { EmployeeUploadComponent } from './employee-upload.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(employeeRoute), LosgwMiscellaneousModule],
  declarations: [
    EmployeeUploadComponent,
    EmployeeComponent,
    EmployeeDetailComponent,
    EmployeeUpdateComponent,
    RoleComponent,
    DelegationAppraisalComponent,
    DelegationApplicationComponent,
    DialogDelegationAppraisalComponent,
    DialogDelegationApplicationComponent,
    RoleUpdateComponent,
    PopupPositionComponent,
  ],
  entryComponents: [EmployeeComponent, EmployeeUpdateComponent, RoleComponent, RoleUpdateComponent, PopupPositionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwEmployeeModule {}
