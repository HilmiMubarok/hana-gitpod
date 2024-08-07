import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { tboCheckingRoute } from './tbo-checking.route';
// import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';
// import { CreditProposalComponent } from './credit-proposal.component';

import { PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { TboCheckingComponent } from './tbo-checking.component';
import { TboCheckingViewComponent } from './tbo-checking-view.component';
import { TboMonitoringModule } from '../tbo-monitoring/tbo-monitoring.module';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, TboMonitoringModule, RouterModule.forChild(tboCheckingRoute)],
  declarations: [TboCheckingComponent, TboCheckingViewComponent],
  entryComponents: [TboCheckingComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TboCheckingModule {}
