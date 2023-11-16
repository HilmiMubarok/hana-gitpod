import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { DeveloperShowDiagramStateComponent } from './diagram-state.component';
import { DeveloperShowDiagramStateDialogComponent } from './diagram-state-dialog.component';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    SharedModule,
    SharedLibsModule,
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'show-diagram-state',
        component: DeveloperShowDiagramStateComponent,
        data: {
          authorities: [Authority.DEVELOPER],
        },
        canActivate: [UserRouteAccessService],
      },
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
  declarations: [DeveloperShowDiagramStateComponent, DeveloperShowDiagramStateDialogComponent],
})
export class DeveloperModule {}
