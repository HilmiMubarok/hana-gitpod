import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FinAccountComponent } from './fin-account.component';
import { FinAccountDetailComponent } from './fin-account-detail.component';
import { FinAccountUpdateComponent } from './fin-account-update.component';
import { finAccountRoute } from './fin-account.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(finAccountRoute)],
  declarations: [FinAccountComponent, FinAccountDetailComponent, FinAccountUpdateComponent],
  entryComponents: [FinAccountComponent, FinAccountUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFinAccountModule {}
