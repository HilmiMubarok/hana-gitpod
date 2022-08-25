import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FinServiceAccountComponent } from './fin-service-account.component';
import { FinServiceAccountDetailComponent } from './fin-service-account-detail.component';
import { FinServiceAccountUpdateComponent } from './fin-service-account-update.component';
import { finServiceAccountRoute } from './fin-service-account.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(finServiceAccountRoute)],
  declarations: [FinServiceAccountComponent, FinServiceAccountDetailComponent, FinServiceAccountUpdateComponent],
  entryComponents: [FinServiceAccountComponent, FinServiceAccountUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFinServiceAccountModule {}
