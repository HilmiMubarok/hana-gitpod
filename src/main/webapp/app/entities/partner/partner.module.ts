import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartnerComponent } from './partner.component';
import { PartnerDetailComponent } from './partner-detail.component';
import { PartnerUpdateComponent } from './partner-update.component';
import { partnerRoute } from './partner.route';
import { PartnerKjppComponent } from './partner-kjpp.component';
import { PartnerKjppCreateComponent } from './partner-kjpp-create.component';
import { PartnerKjppOrganizationComponent } from './partner-organization/partner-kjpp-organization.component';
import { PartnerKjppContactComponent } from './partner-contact/partner-kjpp-contact.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PartnerKjppViewComponent } from './partner-kjpp-view.component';
import { PartnerKjppEditComponent } from './partner-kjpp-edit.component';
import { PartnerViewComponent } from './partner-view.component';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    RouterModule.forChild(partnerRoute),
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  declarations: [
    PartnerComponent,
    PartnerDetailComponent,
    PartnerUpdateComponent,
    PartnerKjppComponent,
    PartnerKjppCreateComponent,
    PartnerKjppOrganizationComponent,
    PartnerKjppContactComponent,
    PartnerKjppViewComponent,
    PartnerKjppEditComponent,
    PartnerViewComponent,
  ],
  entryComponents: [PartnerComponent, PartnerUpdateComponent, PartnerKjppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartnerModule {}
