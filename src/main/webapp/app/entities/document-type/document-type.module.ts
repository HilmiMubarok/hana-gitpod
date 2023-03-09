import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentTypeComponent } from './document-type.component';
import { DocumentTypeDetailComponent } from './document-type-detail.component';
import { DocumentTypeUpdateComponent } from './document-type-update.component';
import { documentTypeRoute } from './document-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(documentTypeRoute)],
  declarations: [DocumentTypeComponent, DocumentTypeDetailComponent, DocumentTypeUpdateComponent],
  entryComponents: [DocumentTypeComponent, DocumentTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwDocumentTypeModule {}
