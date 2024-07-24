import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FeatureTypeComponent } from './feature-type.component';
import { FeatureTypeDetailComponent } from './feature-type-detail.component';
import { FeatureTypeUpdateComponent } from './feature-type-update.component';
import { featureTypeRoute } from './feature-type.route';
import { FeatureTypeViewComponent } from './feature-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(featureTypeRoute)],
  declarations: [FeatureTypeComponent, FeatureTypeDetailComponent, FeatureTypeUpdateComponent, FeatureTypeViewComponent],
  entryComponents: [FeatureTypeComponent, FeatureTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFeatureTypeModule {}
