import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { RelationTypeComponent } from './relation-type.component';
import { RelationTypeDetailComponent } from './relation-type-detail.component';
import { RelationTypeUpdateComponent } from './relation-type-update.component';
import { relationTypeRoute } from './relation-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(relationTypeRoute)],
  declarations: [RelationTypeComponent, RelationTypeDetailComponent, RelationTypeUpdateComponent],
  entryComponents: [RelationTypeComponent, RelationTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwRelationTypeModule {}
