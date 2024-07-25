import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FuncSettingComponent } from './func-setting.component';
import { FuncSettingDetailComponent } from './func-setting-detail.component';
import { FuncSettingUpdateComponent } from './func-setting-update.component';
import { funcSettingRoute } from './func-setting.route';
import { FuncSettingViewComponent } from './func-setting-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(funcSettingRoute)],
  declarations: [FuncSettingComponent, FuncSettingDetailComponent, FuncSettingUpdateComponent, FuncSettingViewComponent],
  entryComponents: [FuncSettingComponent, FuncSettingUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFuncSettingModule {}
