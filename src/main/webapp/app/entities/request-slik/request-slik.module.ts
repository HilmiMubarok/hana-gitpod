import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { RequestSlikComponent } from './request-slik.component';
import { RequestSlikDetailComponent } from './request-slik-detail.component';
import { RequestSlikUpdateComponent } from './request-slik-update.component';
import { requestSlikRoute } from './request-slik.route';
import { DocumentRequestSlikComponent } from './document/document-request-slik.component';
import { DocumentRequestSlikDialogComponent } from './document/dialog/document-request-slik-dialog.component';
import { RequestSlikManagementDataGridComponent } from './management-data/request-slik-management-data-grid.component';
import { RequestSlikShareholderGridComponent } from './shareholder/request-slik-shareholder-grid.component';
import { RequestSlikOtherGridComponent } from './others/request-slik-other-grid.component';
import { RequestSlikBucketComponent } from './request-slik-bucket.component';
import { RequestSlikManagementDataDialogComponent } from './management-data/dialog/request-slik-management-data-dialog.component';
import { RequestSlikDebiturGridComponent } from './debitur/request-slik-debitur-grid.component';
import { RequestSlikPopupComponent } from './dialogs/request-slik-popup.component';
import { RequestSlikDialogSlikFileComponent } from './dialogs/request-slik-dialog-slik-file.component';
import { RequestSlikStatusPipe } from './pipes/request-slik-status.pipe';
import { RequestSlikViewComponent } from './request-slik-view.component';
// import { RequestSlikShareholderGridExpandComponent } from './shareholder/expand/request-slik-shareholder-grid-expand.component';
// import { RequestSlikManagementDataGridExpandComponent } from './management-data/expand/request-slik-management-data-grid-expand.component';
// import { RequestSlikOtherGridExpandComponent } from './others/expand/request-slik-other-grid-expand.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(requestSlikRoute)],
  declarations: [
    RequestSlikComponent,
    RequestSlikDetailComponent,
    RequestSlikUpdateComponent,
    DocumentRequestSlikComponent,
    DocumentRequestSlikDialogComponent,
    RequestSlikManagementDataGridComponent,
    RequestSlikShareholderGridComponent,
    RequestSlikOtherGridComponent,
    RequestSlikBucketComponent,
    RequestSlikManagementDataDialogComponent,
    RequestSlikDebiturGridComponent,
    RequestSlikPopupComponent,
    RequestSlikDialogSlikFileComponent,
    RequestSlikStatusPipe,
    RequestSlikViewComponent,
    // RequestSlikShareholderGridExpandComponent,
    // RequestSlikManagementDataGridExpandComponent,
    // RequestSlikOtherGridExpandComponent,
  ],
  entryComponents: [
    RequestSlikComponent,
    RequestSlikUpdateComponent,
    RequestSlikDetailComponent,
    DocumentRequestSlikComponent,
    DocumentRequestSlikDialogComponent,
    RequestSlikManagementDataGridComponent,
    RequestSlikShareholderGridComponent,
    RequestSlikOtherGridComponent,
    RequestSlikBucketComponent,
    RequestSlikManagementDataDialogComponent,
    RequestSlikDebiturGridComponent,
    RequestSlikPopupComponent,
    RequestSlikDialogSlikFileComponent,
    // RequestSlikShareholderGridExpandComponent,
    // RequestSlikManagementDataGridExpandComponent,
    // RequestSlikOtherGridExpandComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwRequestSlikModule {}
