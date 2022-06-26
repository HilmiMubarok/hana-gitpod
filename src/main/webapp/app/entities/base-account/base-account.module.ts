import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseAccountComponent } from './base-account.component';
import { BaseAccountDetailComponent } from './base-account-detail.component';
import { BaseAccountUpdateComponent } from './base-account-update.component';
import { baseAccountRoute } from './base-account.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(baseAccountRoute)],
  declarations: [BaseAccountComponent, BaseAccountDetailComponent, BaseAccountUpdateComponent],
  entryComponents: [BaseAccountComponent, BaseAccountUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBaseAccountModule {}
