import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PartyCategoryComponent } from './party-category.component';
import { PartyCategoryDetailComponent } from './party-category-detail.component';
import { PartyCategoryUpdateComponent } from './party-category-update.component';
import { partyCategoryRoute } from './party-category.route';
import { PartyCategoryViewComponent } from './party-category-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(partyCategoryRoute)],
  declarations: [PartyCategoryComponent, PartyCategoryDetailComponent, PartyCategoryUpdateComponent, PartyCategoryViewComponent],
  entryComponents: [PartyCategoryComponent, PartyCategoryUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyCategoryModule {}
