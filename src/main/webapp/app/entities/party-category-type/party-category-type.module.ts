import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyCategoryTypeComponent } from './party-category-type.component';
import { PartyCategoryTypeDetailComponent } from './party-category-type-detail.component';
import { PartyCategoryTypeUpdateComponent } from './party-category-type-update.component';
import { partyCategoryTypeRoute } from './party-category-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyCategoryTypeRoute)],
  declarations: [PartyCategoryTypeComponent, PartyCategoryTypeDetailComponent, PartyCategoryTypeUpdateComponent],
  entryComponents: [PartyCategoryTypeComponent, PartyCategoryTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyCategoryTypeModule {}
