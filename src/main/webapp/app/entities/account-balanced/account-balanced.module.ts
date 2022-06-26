import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { AccountBalancedComponent } from './account-balanced.component';
import { AccountBalancedDetailComponent } from './account-balanced-detail.component';
import { AccountBalancedUpdateComponent } from './account-balanced-update.component';
import { accountBalancedRoute } from './account-balanced.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(accountBalancedRoute)],
  declarations: [AccountBalancedComponent, AccountBalancedDetailComponent, AccountBalancedUpdateComponent],
  entryComponents: [AccountBalancedComponent, AccountBalancedUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAccountBalancedModule {}
