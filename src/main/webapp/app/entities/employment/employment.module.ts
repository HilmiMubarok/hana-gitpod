import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { EmploymentComponent } from './employment.component';
import { EmploymentDetailComponent } from './employment-detail.component';
import { EmploymentUpdateComponent } from './employment-update.component';
import { employmentRoute } from './employment.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(employmentRoute)],
  declarations: [EmploymentComponent, EmploymentDetailComponent, EmploymentUpdateComponent],
  entryComponents: [EmploymentComponent, EmploymentUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwEmploymentModule {}
