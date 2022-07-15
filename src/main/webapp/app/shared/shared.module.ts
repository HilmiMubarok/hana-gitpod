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

import { ButtonComponent } from './custom-component/button/button-component';
import { TextBoxComponent } from './custom-component/text-box/text-box-component';
import { RibbonComponent } from './custom-component/ribbon/ribbon-component';

import { ButtonModule, RadioButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';

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
    FormatMediumDatePipe,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    ButtonComponent,
    TextBoxComponent,
    RibbonComponent,
  ],
  exports: [
    ButtonModule,
    RadioButtonModule,
    SwitchModule,
    NumericTextBoxModule,
    ComboBoxModule,
    TextBoxModule,
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
    TextBoxComponent,
    RibbonComponent,
  ],
})
export class SharedModule {}
