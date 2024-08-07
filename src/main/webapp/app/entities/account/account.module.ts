import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { accountRoute } from './account.route';
import { AccountViewComponent } from './account-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(accountRoute)],
  declarations: [AccountViewComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAccountModule {}
