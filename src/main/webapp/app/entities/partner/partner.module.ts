import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartnerComponent } from './partner.component';
import { PartnerDetailComponent } from './partner-detail.component';
import { PartnerUpdateComponent } from './partner-update.component';
import { partnerRoute } from './partner.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partnerRoute)],
  declarations: [PartnerComponent, PartnerDetailComponent, PartnerUpdateComponent],
  entryComponents: [PartnerComponent, PartnerUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartnerModule {}
