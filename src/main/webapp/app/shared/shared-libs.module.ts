import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { ComboBoxModule, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
// ngx-currency
import { NgxCurrencyModule } from 'ngx-currency';

// prime ng
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { ChipsModule } from 'primeng/chips';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TimelineModule } from 'primeng/timeline';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';

// Loading Bar
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';

// ngx module
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Ej2
import { ButtonModule, CheckBoxModule as EJ2CheckBoxModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';

import { DialogModule as EJ2DialogModule } from '@syncfusion/ej2-angular-popups';
import { AccordionModule, MenuModule, TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { GridModule, PageService } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
// import { RichTextEditorModule, RichTextEditorAllModule, ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import {
  RichTextEditorAllModule,
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
} from '@syncfusion/ej2-angular-richtexteditor';

// Siapa yang pakai? - Start
// import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
// import { SplitButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
// Siapa yang pakai? - End

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  exports: [
    FormsModule,
    CommonModule,
    NgbModule,
    InfiniteScrollModule,
    FontAwesomeModule,
    ReactiveFormsModule,

    // ngx currency
    NgxCurrencyModule,

    // primeng
    DataViewModule,
    TableModule,
    CalendarModule,
    ListboxModule,
    AutoCompleteModule,
    PanelModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    SharedModule,
    DividerModule,
    TabViewModule,
    ChipsModule,
    MultiSelectModule,
    InputSwitchModule,
    InputTextareaModule,
    InputTextModule,
    TimelineModule,
    ChipModule,
    BadgeModule,
    DropdownModule,
    CheckboxModule,
    DropDownButtonModule,

    // ngx
    TabsModule,
    TooltipModule,

    // Loading bar
    LoadingBarHttpClientModule,
    LoadingBarModule,
    TranslateModule,

    // angular material
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,

    // Ej2
    ComboBoxModule,
    DropDownListModule,
    EJ2CheckBoxModule,
    ButtonModule,
    RadioButtonModule,
    EJ2DialogModule,
    MenuModule,
    TabModule,
    GridModule,
    NumericTextBoxModule,
    TextBoxModule,
    UploaderModule,
    // RichTextEditorModule,
    RichTextEditorAllModule,

    // DropDownButtonModule,
    // DatePickerModule,
    // SplitButtonModule,

    AccordionModule,
    ToolbarModule,
  ],
  providers: [PageService, ToolbarService, LinkService, ImageService, HtmlEditorService],
})
export class SharedLibsModule {}
