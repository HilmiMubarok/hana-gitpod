import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { InternalComponent } from './internal.component';
import { InternalDetailComponent } from './internal-detail.component';
import { InternalUpdateComponent } from './internal-update.component';
import { internalRoute } from './internal.route';
import { InternalCreateComponent } from './internal-create.component';
import { InternalAddressViewComponent } from './internal-address/internal-address-view.component';
import { InternalViewComponent } from './internal-view.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(internalRoute)],
  declarations: [
    InternalComponent,
    InternalDetailComponent,
    InternalUpdateComponent,
    InternalCreateComponent,
    InternalAddressViewComponent,
    InternalViewComponent,
  ],
  entryComponents: [
    InternalComponent,
    InternalUpdateComponent,
    InternalCreateComponent,
    InternalAddressViewComponent,
    InternalViewComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwInternalModule {}
