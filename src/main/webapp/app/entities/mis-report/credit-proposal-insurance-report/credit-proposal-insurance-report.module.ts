import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditProposalInsuranceReportComponent } from './credit-proposal-insurance-report.component';

const routes: Routes = [
    {
        path: '',
        component: CreditProposalInsuranceReportComponent,
        canActivate: [UserRouteAccessService],
        data: {
            pageTitle: 'losgwApp.creditProposal.home.title',
        },
    },
];

@NgModule({
    imports: [SharedModule, RouterModule.forChild(routes)],
    declarations: [CreditProposalInsuranceReportComponent],
    providers: [],
    exports: [],
})
export class CreditProposalInsuranceReportModule { }

