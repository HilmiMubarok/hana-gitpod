import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { GLResourceTypeComponent } from './gl-resource-type.component';
import { GLResourceTypeDetailComponent } from './gl-resource-type-detail.component';
import { GLResourceTypeUpdateComponent } from './gl-resource-type-update.component';
import { gLResourceTypeRoute } from './gl-resource-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(gLResourceTypeRoute)],
  declarations: [GLResourceTypeComponent, GLResourceTypeDetailComponent, GLResourceTypeUpdateComponent],
  entryComponents: [GLResourceTypeComponent, GLResourceTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGLResourceTypeModule {}
