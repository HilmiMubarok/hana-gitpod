import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { darRevisionRoute } from './dar-revision.route';
// import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';
// import { CreditProposalComponent } from './credit-proposal.component';

import { PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { DarRevisionComponent } from './dar-revision.component';
import { DarRevisionViewComponent } from './dar-revision-view.component';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';

@NgModule({
  imports: [SharedModule, SharedLibsModule, ExposureModule, SharedEntityModule, MemoBandingModule, RouterModule.forChild(darRevisionRoute)],
  declarations: [DarRevisionComponent, DarRevisionViewComponent],
  entryComponents: [DarRevisionComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DarRevisionModule {}
