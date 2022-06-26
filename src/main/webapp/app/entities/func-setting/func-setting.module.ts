import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FuncSettingComponent } from './func-setting.component';
import { FuncSettingDetailComponent } from './func-setting-detail.component';
import { FuncSettingUpdateComponent } from './func-setting-update.component';
import { funcSettingRoute } from './func-setting.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(funcSettingRoute)],
  declarations: [FuncSettingComponent, FuncSettingDetailComponent, FuncSettingUpdateComponent],
  entryComponents: [FuncSettingComponent, FuncSettingUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFuncSettingModule {}
