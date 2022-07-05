import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationFinancialComponent } from './list/organization-financial.component';
import { OrganizationFinancialDetailComponent } from './detail/organization-financial-detail.component';
import { OrganizationFinancialUpdateComponent } from './update/organization-financial-update.component';
import { OrganizationFinancialDeleteDialogComponent } from './delete/organization-financial-delete-dialog.component';
import { OrganizationFinancialRoutingModule } from './route/organization-financial-routing.module';

@NgModule({
  imports: [SharedModule, OrganizationFinancialRoutingModule],
  declarations: [
    OrganizationFinancialComponent,
    OrganizationFinancialDetailComponent,
    OrganizationFinancialUpdateComponent,
    OrganizationFinancialDeleteDialogComponent,
  ],
  entryComponents: [OrganizationFinancialDeleteDialogComponent],
})
export class OrganizationFinancialModule {}
