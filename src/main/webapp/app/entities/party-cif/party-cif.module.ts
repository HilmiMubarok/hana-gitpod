import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyCifComponent } from './party-cif.component';
import { PartyCifDetailComponent } from './party-cif-detail.component';
import { PartyCifUpdateComponent } from './party-cif-update.component';
import { partyCifRoute } from './party-cif.route';
import { PartyCifCustomerInfoComponent } from './customer-info/party-cif-customer-info.component';
import { PartyCifCustomerInfoPersonComponent } from './customer-info/party-cif-customer-info-person.component';
import { PartyCifCustomerInfoDebtorDataComponent } from './customer-info/party-cif-customer-info-debtor-data.component';
import { PartyCifDocumentChecklistComponent } from './document-checklist/party-cif-document.checklist.component';
import { PartyCifCustomerInfoRMInfoComponent } from './customer-info/party-cif-customer-info-rm-info.component';
import { PartyCifCustomerInfoPostalAddressComponent } from './customer-info/party-cif-customer-info-postal-address.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyCifRoute)],
  declarations: [
    PartyCifComponent,
    PartyCifDetailComponent,
    PartyCifUpdateComponent,
    PartyCifCustomerInfoComponent,
    PartyCifCustomerInfoPersonComponent,
    PartyCifCustomerInfoDebtorDataComponent,
    PartyCifDocumentChecklistComponent,
    PartyCifCustomerInfoRMInfoComponent,
    PartyCifCustomerInfoPostalAddressComponent,
  ],
  entryComponents: [PartyCifComponent, PartyCifUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyCifModule {}
