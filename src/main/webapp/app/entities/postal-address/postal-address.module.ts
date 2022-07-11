import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PostalAddressUpdateComponent } from './postal-address-update.component';
import { postalAddressRoute } from './postal-address.route';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(postalAddressRoute), ButtonModule],
  declarations: [PostalAddressUpdateComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPostalAddressyModule {}
