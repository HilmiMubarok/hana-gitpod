import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ParentOrganizationComponent } from './parent-organization.component';
import { ParentOrganizationDetailComponent } from './parent-organization-detail.component';
import { ParentOrganizationUpdateComponent } from './parent-organization-update.component';
import { parentOrganizationRoute } from './parent-organization.route';
import { ParentOrganizationViewComponent } from './parent-organization-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(parentOrganizationRoute)],
  declarations: [
    ParentOrganizationComponent,
    ParentOrganizationDetailComponent,
    ParentOrganizationUpdateComponent,
    ParentOrganizationViewComponent,
  ],
  entryComponents: [ParentOrganizationComponent, ParentOrganizationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwParentOrganizationModule {}
