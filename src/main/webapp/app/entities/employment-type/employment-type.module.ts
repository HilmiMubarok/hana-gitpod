import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { EmploymentTypeComponent } from './employment-type.component';
import { EmploymentTypeDetailComponent } from './employment-type-detail.component';
import { EmploymentTypeUpdateComponent } from './employment-type-update.component';
import { employmentTypeRoute } from './employment-type.route';
import { EmploymentTypeViewComponent } from './employment-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(employmentTypeRoute)],
  declarations: [EmploymentTypeComponent, EmploymentTypeDetailComponent, EmploymentTypeUpdateComponent, EmploymentTypeViewComponent],
  entryComponents: [EmploymentTypeComponent, EmploymentTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwEmploymentTypeModule {}
