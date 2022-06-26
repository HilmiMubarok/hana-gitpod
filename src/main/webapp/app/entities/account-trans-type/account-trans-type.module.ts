import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { AccountTransTypeComponent } from './account-trans-type.component';
import { AccountTransTypeDetailComponent } from './account-trans-type-detail.component';
import { AccountTransTypeUpdateComponent } from './account-trans-type-update.component';
import { accountTransTypeRoute } from './account-trans-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(accountTransTypeRoute)],
  declarations: [AccountTransTypeComponent, AccountTransTypeDetailComponent, AccountTransTypeUpdateComponent],
  entryComponents: [AccountTransTypeComponent, AccountTransTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAccountTransTypeModule {}
