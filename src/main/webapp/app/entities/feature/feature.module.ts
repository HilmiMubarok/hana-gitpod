import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FeatureComponent } from './feature.component';
import { FeatureDetailComponent } from './feature-detail.component';
import { FeatureUpdateComponent } from './feature-update.component';
import { featureRoute } from './feature.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(featureRoute)],
  declarations: [FeatureComponent, FeatureDetailComponent, FeatureUpdateComponent],
  entryComponents: [FeatureComponent, FeatureUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFeatureModule {}
