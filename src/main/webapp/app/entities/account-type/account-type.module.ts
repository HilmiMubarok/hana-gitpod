import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { AccountTypeComponent } from './account-type.component';
import { AccountTypeDetailComponent } from './account-type-detail.component';
import { AccountTypeUpdateComponent } from './account-type-update.component';
import { accountTypeRoute } from './account-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(accountTypeRoute)],
  declarations: [AccountTypeComponent, AccountTypeDetailComponent, AccountTypeUpdateComponent],
  entryComponents: [AccountTypeComponent, AccountTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAccountTypeModule {}
