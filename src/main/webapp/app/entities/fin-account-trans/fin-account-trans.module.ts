import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FinAccountTransComponent } from './fin-account-trans.component';
import { FinAccountTransDetailComponent } from './fin-account-trans-detail.component';
import { FinAccountTransUpdateComponent } from './fin-account-trans-update.component';
import { finAccountTransRoute } from './fin-account-trans.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(finAccountTransRoute)],
  declarations: [FinAccountTransComponent, FinAccountTransDetailComponent, FinAccountTransUpdateComponent],
  entryComponents: [FinAccountTransComponent, FinAccountTransUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFinAccountTransModule {}
