import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { TermTypeComponent } from './term-type.component';
import { TermTypeDetailComponent } from './term-type-detail.component';
import { TermTypeUpdateComponent } from './term-type-update.component';
import { termTypeRoute } from './term-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(termTypeRoute)],
  declarations: [TermTypeComponent, TermTypeDetailComponent, TermTypeUpdateComponent],
  entryComponents: [TermTypeComponent, TermTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwTermTypeModule {}
