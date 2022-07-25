import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';

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
import { AccordionModule } from 'primeng/accordion';
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
import { ButtonModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';

// Loading Bar
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';

// ngx module
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { MenuModule, TabModule } from '@syncfusion/ej2-angular-navigations';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule as EJ2DialogModule } from '@syncfusion/ej2-angular-popups';
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
    TextBoxModule,
    ComboBoxModule,
    RadioButtonModule,
    DropDownListModule,

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
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule,
    SharedModule,
    DividerModule,
    AccordionModule,
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

    // ngx
    TabsModule,
    TooltipModule,

    // Loading bar
    LoadingBarHttpClientModule,
    LoadingBarModule,
    TranslateModule,

    ButtonModule,
    NumericTextBoxModule,

    // angular material
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,

    // syncfusion
    TabModule,
    MenuModule,
    GridModule,
    EJ2DialogModule,
    UploaderModule,
  ],
})
export class SharedLibsModule {}
