import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { GoodComponent } from './good.component';
import { GoodDetailComponent } from './good-detail.component';
import { GoodUpdateComponent } from './good-update.component';
import { goodRoute } from './good.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(goodRoute)],
  declarations: [GoodComponent, GoodDetailComponent, GoodUpdateComponent],
  entryComponents: [GoodComponent, GoodUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGoodModule {}
