import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { GLAccountComponent } from './gl-account.component';
import { GLAccountDetailComponent } from './gl-account-detail.component';
import { GLAccountUpdateComponent } from './gl-account-update.component';
import { gLAccountRoute } from './gl-account.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(gLAccountRoute)],
  declarations: [GLAccountComponent, GLAccountDetailComponent, GLAccountUpdateComponent],
  entryComponents: [GLAccountComponent, GLAccountUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGLAccountModule {}
