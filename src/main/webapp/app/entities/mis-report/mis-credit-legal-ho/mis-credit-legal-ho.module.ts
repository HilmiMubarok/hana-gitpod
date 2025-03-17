import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { MisCreditLegalHoComponent } from "./mis-credit-legal-ho.component";
import { MisCreditLegalHoReportComponent } from "./report/mis-credit-legal-ho-report.component";
import { RouterModule, Routes } from "@angular/router";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { SharedModule } from "app/shared/shared.module";

const routes: Routes = [
    {
        path: '',
        component: MisCreditLegalHoComponent,
        canActivate: [UserRouteAccessService],
        data: {
            pageTitle: 'losgwApp.slaReviewer.home.title',
        },
    },
];

@NgModule({
    declarations: [MisCreditLegalHoComponent, MisCreditLegalHoReportComponent],
    imports: [SharedModule, RouterModule.forChild(routes)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MisCreditLegalHoModule { }