import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { GLAccountClassComponent } from './gl-account-class.component';
import { GLAccountClassDetailComponent } from './gl-account-class-detail.component';
import { GLAccountClassUpdateComponent } from './gl-account-class-update.component';
import { gLAccountClassRoute } from './gl-account-class.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(gLAccountClassRoute)],
  declarations: [GLAccountClassComponent, GLAccountClassDetailComponent, GLAccountClassUpdateComponent],
  entryComponents: [GLAccountClassComponent, GLAccountClassUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGLAccountClassModule {}
