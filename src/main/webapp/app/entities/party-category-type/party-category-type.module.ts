import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { partyCategoryTypeRoute } from './party-category-type.route';
import { PartyCategoryTypeViewComponent } from './party-category-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(partyCategoryTypeRoute)],
  declarations: [PartyCategoryTypeViewComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyCategoryTypeModule {}
