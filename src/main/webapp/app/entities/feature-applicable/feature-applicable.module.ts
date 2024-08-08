import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FeatureApplicableComponent } from './feature-applicable.component';
import { FeatureApplicableDetailComponent } from './feature-applicable-detail.component';
import { FeatureApplicableUpdateComponent } from './feature-applicable-update.component';
import { featureApplicableRoute } from './feature-applicable.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(featureApplicableRoute)],
  declarations: [FeatureApplicableComponent, FeatureApplicableDetailComponent, FeatureApplicableUpdateComponent],
  entryComponents: [FeatureApplicableComponent, FeatureApplicableUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFeatureApplicableModule {}
