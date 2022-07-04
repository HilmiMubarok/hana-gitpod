import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationLegalComponent } from './list/organization-legal.component';
import { OrganizationLegalDetailComponent } from './detail/organization-legal-detail.component';
import { OrganizationLegalUpdateComponent } from './update/organization-legal-update.component';
import { OrganizationLegalDeleteDialogComponent } from './delete/organization-legal-delete-dialog.component';
import { OrganizationLegalRoutingModule } from './route/organization-legal-routing.module';

@NgModule({
  imports: [SharedModule, OrganizationLegalRoutingModule],
  declarations: [
    OrganizationLegalComponent,
    OrganizationLegalDetailComponent,
    OrganizationLegalUpdateComponent,
    OrganizationLegalDeleteDialogComponent,
  ],
  entryComponents: [OrganizationLegalDeleteDialogComponent],
})
export class OrganizationLegalModule {}
