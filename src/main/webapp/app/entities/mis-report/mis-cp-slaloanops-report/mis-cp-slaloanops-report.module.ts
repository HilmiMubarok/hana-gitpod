import { NgModule } from "@angular/core";
import { MisCpSlaloanopsReportComponent } from "./mis-cp-slaloanops-report.component";
import { SharedModule } from "app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";

const routes: Routes = [
    {
        path: '',
        component: MisCpSlaloanopsReportComponent,
        canActivate: [UserRouteAccessService],
        data: {
            pageTitle: 'losgwApp.slaReviewer.home.title',
        },
    },
];


@NgModule({
    imports: [SharedModule, RouterModule.forChild(routes)],
    declarations: [
        MisCpSlaloanopsReportComponent
    ],
})
export class MisCpSlaloanopsReportModule { }