import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyCategoryComponent } from './party-category.component';
import { PartyCategoryDetailComponent } from './party-category-detail.component';
import { PartyCategoryUpdateComponent } from './party-category-update.component';
import { partyCategoryRoute } from './party-category.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyCategoryRoute)],
  declarations: [PartyCategoryComponent, PartyCategoryDetailComponent, PartyCategoryUpdateComponent],
  entryComponents: [PartyCategoryComponent, PartyCategoryUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyCategoryModule {}
