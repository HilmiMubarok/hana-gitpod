import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { AccountTransCategoryComponent } from './account-trans-category.component';
import { AccountTransCategoryDetailComponent } from './account-trans-category-detail.component';
import { AccountTransCategoryUpdateComponent } from './account-trans-category-update.component';
import { accountTransCategoryRoute } from './account-trans-category.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(accountTransCategoryRoute)],
  declarations: [AccountTransCategoryComponent, AccountTransCategoryDetailComponent, AccountTransCategoryUpdateComponent],
  entryComponents: [AccountTransCategoryComponent, AccountTransCategoryUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAccountTransCategoryModule {}
