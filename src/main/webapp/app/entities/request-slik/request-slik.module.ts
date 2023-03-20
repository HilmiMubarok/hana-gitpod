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
import { MatInputModule } from '@angular/material/input';
import { RequestSlikManagementDataGridComponent } from './management-data/request-slik-management-data-grid.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(requestSlikRoute)],
  declarations: [
    RequestSlikComponent,
    RequestSlikDetailComponent,
    RequestSlikUpdateComponent,
    DocumentRequestSlikComponent,
    DocumentRequestSlikDialogComponent,
    RequestSlikManagementDataGridComponent,
  ],
  entryComponents: [
    RequestSlikComponent,
    RequestSlikUpdateComponent,
    RequestSlikDetailComponent,
    DocumentRequestSlikComponent,
    DocumentRequestSlikDialogComponent,
    RequestSlikManagementDataGridComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwRequestSlikModule {}
