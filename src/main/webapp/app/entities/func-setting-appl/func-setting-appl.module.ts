import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FuncSettingApplComponent } from './func-setting-appl.component';
import { FuncSettingApplDetailComponent } from './func-setting-appl-detail.component';
import { FuncSettingApplUpdateComponent } from './func-setting-appl-update.component';
import { funcSettingApplRoute } from './func-setting-appl.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(funcSettingApplRoute)],
  declarations: [FuncSettingApplComponent, FuncSettingApplDetailComponent, FuncSettingApplUpdateComponent],
  entryComponents: [FuncSettingApplComponent, FuncSettingApplUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFuncSettingApplModule {}
