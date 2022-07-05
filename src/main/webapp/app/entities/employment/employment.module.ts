import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmploymentComponent } from './list/employment.component';
import { EmploymentDetailComponent } from './detail/employment-detail.component';
import { EmploymentUpdateComponent } from './update/employment-update.component';
import { EmploymentDeleteDialogComponent } from './delete/employment-delete-dialog.component';
import { EmploymentRoutingModule } from './route/employment-routing.module';

@NgModule({
  imports: [SharedModule, EmploymentRoutingModule],
  declarations: [EmploymentComponent, EmploymentDetailComponent, EmploymentUpdateComponent, EmploymentDeleteDialogComponent],
  entryComponents: [EmploymentDeleteDialogComponent],
})
export class EmploymentModule {}
