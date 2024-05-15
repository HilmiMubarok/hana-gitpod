import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { MasterDocumentTermRoute } from './master-document-term.route';
import { MasterDocumentTermComponent } from './master-document-term.component';
import { MasterDocumentTermDialogComponent } from './master-document-term-dialog.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(MasterDocumentTermRoute)],
  declarations: [MasterDocumentTermComponent, MasterDocumentTermDialogComponent],
  entryComponents: [MasterDocumentTermComponent, MasterDocumentTermDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMasterDocumentTermModule {}
