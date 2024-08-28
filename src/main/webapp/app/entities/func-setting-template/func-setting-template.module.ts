import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FuncSettingTemplateComponent } from './func-setting-template.component';
import { FuncSettingTemplateDetailComponent } from './func-setting-template-detail.component';
import { FuncSettingTemplateUpdateComponent } from './func-setting-template-update.component';
import { funcSettingTemplateRoute } from './func-setting-template.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(funcSettingTemplateRoute)],
  declarations: [FuncSettingTemplateComponent, FuncSettingTemplateDetailComponent, FuncSettingTemplateUpdateComponent],
  entryComponents: [FuncSettingTemplateComponent, FuncSettingTemplateUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFuncSettingTemplateModule {}
