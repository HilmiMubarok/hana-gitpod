import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FuncSettingTemplateComponent } from './func-setting-template.component';
import { FuncSettingTemplateDetailComponent } from './func-setting-template-detail.component';
import { FuncSettingTemplateUpdateComponent } from './func-setting-template-update.component';
import { funcSettingTemplateRoute } from './func-setting-template.route';
import { FuncSettingTemplateViewComponent } from './func-setting-template-view.component';
@NgModule({
  imports: [SharedModule, RouterModule.forChild(funcSettingTemplateRoute)],
  declarations: [
    FuncSettingTemplateComponent,
    FuncSettingTemplateDetailComponent,
    FuncSettingTemplateUpdateComponent,
    FuncSettingTemplateViewComponent,
  ],
  entryComponents: [FuncSettingTemplateComponent, FuncSettingTemplateUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFuncSettingTemplateModule {}
