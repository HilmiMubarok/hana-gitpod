import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { GLAccountTypeComponent } from './gl-account-type.component';
import { GLAccountTypeDetailComponent } from './gl-account-type-detail.component';
import { GLAccountTypeUpdateComponent } from './gl-account-type-update.component';
import { gLAccountTypeRoute } from './gl-account-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(gLAccountTypeRoute)],
  declarations: [GLAccountTypeComponent, GLAccountTypeDetailComponent, GLAccountTypeUpdateComponent],
  entryComponents: [GLAccountTypeComponent, GLAccountTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGLAccountTypeModule {}
