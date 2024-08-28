import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FeatureTypeComponent } from './feature-type.component';
import { FeatureTypeDetailComponent } from './feature-type-detail.component';
import { FeatureTypeUpdateComponent } from './feature-type-update.component';
import { featureTypeRoute } from './feature-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(featureTypeRoute)],
  declarations: [FeatureTypeComponent, FeatureTypeDetailComponent, FeatureTypeUpdateComponent],
  entryComponents: [FeatureTypeComponent, FeatureTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFeatureTypeModule {}
