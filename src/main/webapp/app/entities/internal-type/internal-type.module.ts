import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { InternalTypeComponent } from './internal-type.component';
import { InternalTypeDetailComponent } from './internal-type-detail.component';
import { InternalTypeUpdateComponent } from './internal-type-update.component';
import { internalTypeRoute } from './internal-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(internalTypeRoute)],
  declarations: [InternalTypeComponent, InternalTypeDetailComponent, InternalTypeUpdateComponent],
  entryComponents: [InternalTypeComponent, InternalTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwInternalTypeModule {}
