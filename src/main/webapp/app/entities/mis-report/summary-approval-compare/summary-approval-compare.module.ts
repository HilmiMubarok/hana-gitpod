import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { SharedModule } from "app/shared/shared.module";
import { SummaryApprovalCompareComponent } from "./summary-approval-compare.component";

const route: Routes = [
    {
        path: '',
        component: SummaryApprovalCompareComponent,
        canActivate: [UserRouteAccessService],
        data: {
            pageTitle: 'losgwApp.creditProposal.home.title',
        },
    },
];

@NgModule({
    declarations: [SummaryApprovalCompareComponent],
    imports: [RouterModule.forChild(route), SharedModule],
})
export class SummaryApprovalCompareModule {}
