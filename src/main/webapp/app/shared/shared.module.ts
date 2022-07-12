import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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

import { ButtonComponent } from '../entities/sample-ejs/button/button-component';
import { RibbonComponent } from '../entities/sample-ejs/ribbon/ribbon-component';

import { TextBoxStringComponent } from '../entities/sample-ejs/text-box/string/default/text-box-component';
import { TextBoxStringReadOnlyComponent } from '../entities/sample-ejs/text-box/string/readonly/text-box-component';
import { TextBoxNumericComponent } from '../entities/sample-ejs/text-box/numeric/notFormated/default/text-box-component';
import { TextBoxNumericReadOnlyComponent } from '../entities/sample-ejs/text-box/numeric/notFormated/readonly/text-box-component';
import { TextBoxNumericFormatedComponent } from '../entities/sample-ejs/text-box/numeric/formated/default/text-box-component';
import { TextBoxNumericFormatedReadOnlyComponent } from '../entities/sample-ejs/text-box/numeric/formated/readonly/text-box-component';

import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  imports: [SharedLibsModule, ButtonModule, TextBoxModule, NumericTextBoxModule],
  declarations: [
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    ButtonComponent,
    TextBoxStringComponent,
    TextBoxStringReadOnlyComponent,
    TextBoxNumericComponent,
    TextBoxNumericReadOnlyComponent,
    TextBoxNumericFormatedComponent,
    TextBoxNumericFormatedReadOnlyComponent,
    RibbonComponent,
  ],
  exports: [
    SharedLibsModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    ButtonComponent,
    TextBoxStringComponent,
    TextBoxStringReadOnlyComponent,
    TextBoxNumericComponent,
    TextBoxNumericReadOnlyComponent,
    TextBoxNumericFormatedComponent,
    TextBoxNumericFormatedReadOnlyComponent,
    RibbonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
