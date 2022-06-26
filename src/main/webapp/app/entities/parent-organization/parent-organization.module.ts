import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ParentOrganizationComponent } from './parent-organization.component';
import { ParentOrganizationDetailComponent } from './parent-organization-detail.component';
import { ParentOrganizationUpdateComponent } from './parent-organization-update.component';
import { parentOrganizationRoute } from './parent-organization.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(parentOrganizationRoute)],
  declarations: [ParentOrganizationComponent, ParentOrganizationDetailComponent, ParentOrganizationUpdateComponent],
  entryComponents: [ParentOrganizationComponent, ParentOrganizationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwParentOrganizationModule {}
