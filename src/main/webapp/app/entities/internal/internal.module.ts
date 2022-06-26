import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { InternalComponent } from './internal.component';
import { InternalDetailComponent } from './internal-detail.component';
import { InternalUpdateComponent } from './internal-update.component';
import { internalRoute } from './internal.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(internalRoute)],
  declarations: [InternalComponent, InternalDetailComponent, InternalUpdateComponent],
  entryComponents: [InternalComponent, InternalUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwInternalModule {}
