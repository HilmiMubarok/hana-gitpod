import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { AccountTransComponent } from './account-trans.component';
import { AccountTransDetailComponent } from './account-trans-detail.component';
import { AccountTransUpdateComponent } from './account-trans-update.component';
import { accountTransRoute } from './account-trans.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(accountTransRoute)],
  declarations: [AccountTransComponent, AccountTransDetailComponent, AccountTransUpdateComponent],
  entryComponents: [AccountTransComponent, AccountTransUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAccountTransModule {}
