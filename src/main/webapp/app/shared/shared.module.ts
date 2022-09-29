import { NgModule } from '@angular/core';
import { SharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { TranslateDirective } from './language/translate.directive';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { DurationPipe } from './date/duration.pipe';
import { FormatMediumDatetimePipe } from './date/format-medium-datetime.pipe';
import { FormatMediumDatePipe } from './date/format-medium-date.pipe';
import { SortByDirective } from './sort/sort-by.directive';
import { SortDirective } from './sort/sort.directive';
import { ItemCountComponent } from './pagination/item-count.component';

import { ButtonComponent } from './custom-component/button/button-component';
import { TextBoxComponent } from './custom-component/text-box/text-box-component';
import { RibbonComponent } from './custom-component/ribbon/ribbon-component';

import { DragndropDirective } from './dragndrop/dragndrop.directive';
import { AgePipe } from './date/age.pipe';
import { ArrayCountPipe } from './directives/array-count.pipe';
import { TaskCommentDialogComponent } from 'app/layouts/miscellaneous/task-comment-dialog.component';
import { NoRecordFoundComponent } from 'app/layouts/miscellaneous/no-record-found.component';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';

@NgModule({
  imports: [SharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    ArrayCountPipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    DragndropDirective,
    ItemCountComponent,
    ButtonComponent,
    TextBoxComponent,
    RibbonComponent,
    AgePipe,
    TaskCommentDialogComponent,
    NoRecordFoundComponent,
    TimelineDialogComponent,
  ],
  exports: [
    SharedLibsModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    ArrayCountPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    DragndropDirective,
    ItemCountComponent,
    ButtonComponent,
    TextBoxComponent,
    RibbonComponent,
    AgePipe,
    TaskCommentDialogComponent,
    NoRecordFoundComponent,
    TimelineDialogComponent,
  ],
})
export class SharedModule {}
