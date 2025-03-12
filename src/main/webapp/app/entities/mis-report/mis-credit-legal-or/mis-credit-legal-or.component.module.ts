import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MisCreditLegalOrComponent } from './report/mis-credit-legal-or.component';

const cpfRoute: Routes = [
  {
    path: '',
    component: MisCreditLegalOrComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];
@NgModule({
  imports: [SharedModule, RouterModule.forChild(cpfRoute)],
  declarations: [MisCreditLegalOrComponent],
  providers: [],
  exports: [],
})
export class MisCreditLegalOrModule {}
