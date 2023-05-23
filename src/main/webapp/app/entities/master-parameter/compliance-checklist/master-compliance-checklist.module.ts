import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { MasterComplianceChecklistComponent } from './master-compliance-checklist.component';
import { masterComplianceChecklistRoute } from './master-compliance-checklist.route';
import { MasterComplianceChecklistDialogComponent } from './master-compliance-checklist-dialog.component';
import { ComplianceChecklistCriteriaDialogAddComponent } from './compliance-checklist-criteria/compliance-checklist-criteria-dialog.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(masterComplianceChecklistRoute)],
  declarations: [
    MasterComplianceChecklistComponent,
    MasterComplianceChecklistDialogComponent,
    ComplianceChecklistCriteriaDialogAddComponent,
  ],
  entryComponents: [MasterComplianceChecklistDialogComponent, ComplianceChecklistCriteriaDialogAddComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMasterComplianceChecklistModule {}
