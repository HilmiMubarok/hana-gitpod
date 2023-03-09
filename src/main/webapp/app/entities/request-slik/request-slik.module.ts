import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { RequestSlikComponent } from './request-slik.component';
import { RequestSlikDetailComponent } from './request-slik-detail.component';
import { RequestSlikUpdateComponent } from './request-slik-update.component';
import { requestSlikRoute } from './request-slik.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(requestSlikRoute)],
  declarations: [RequestSlikComponent, RequestSlikDetailComponent, RequestSlikUpdateComponent],
  entryComponents: [RequestSlikComponent, RequestSlikUpdateComponent, RequestSlikDetailComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwRequestSlikModule {}
