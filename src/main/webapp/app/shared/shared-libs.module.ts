import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

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
import { CarouselModule } from 'primeng/carousel';

// Loading Bar
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarModule } from '@ngx-loading-bar/core';

// ngx module
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Ej2
import { ButtonModule, CheckBoxModule as EJ2CheckBoxModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { ComboBoxModule, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule as EJ2DialogModule } from '@syncfusion/ej2-angular-popups';
import { AccordionModule, MenuModule, TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DetailRowService, GridModule, PageService } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxModule, TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import {
  RichTextEditorAllModule,
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
} from '@syncfusion/ej2-angular-richtexteditor';

import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ChipListModule } from '@syncfusion/ej2-angular-buttons';
import { MultiSelectModule as MultiSelectModuleEj2 } from '@syncfusion/ej2-angular-dropdowns';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { BreadcrumbModule } from '@syncfusion/ej2-angular-navigations';
import { ResizeService } from '@syncfusion/ej2-angular-grids';
import {
  PdfViewerModule,
  LinkAnnotationService,
  BookmarkViewService,
  MagnificationService,
  ThumbnailViewService,
  NavigationService,
  TextSearchService,
  TextSelectionService,
  PrintService,
} from '@syncfusion/ej2-angular-pdfviewer';

import { SearchService } from '@syncfusion/ej2-angular-grids';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  providers: [
    PageService,
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    DetailRowService,
    ResizeService,
    LinkAnnotationService,
    BookmarkViewService,
    MagnificationService,
    ThumbnailViewService,
    NavigationService,
    TextSearchService,
    TextSelectionService,
    PrintService,
    SearchService,
    DatePipe,
  ],
  exports: [
    PdfViewerModule,
    FormsModule,
    CommonModule,
    NgbModule,
    InfiniteScrollModule,
    FontAwesomeModule,
    ReactiveFormsModule,

    // ngx currency
    NgxCurrencyModule,
    NgxDropzoneModule,

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
    CarouselModule,

    // ngx
    TabsModule,
    TooltipModule,

    // Loading bar
    LoadingBarHttpClientModule,
    LoadingBarModule,
    TranslateModule,

    // angular material
    MatTreeModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
    MatTooltipModule,
    MatRadioModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatMenuModule,

    // Ej2
    ComboBoxModule,
    DropDownListModule,
    EJ2CheckBoxModule,
    ButtonModule,
    RadioButtonModule,

    MenuModule,
    TabModule,
    GridModule,
    NumericTextBoxModule,
    EJ2DialogModule,
    UploaderModule,
    DatePickerModule,
    TextBoxModule,
    UploaderModule,
    RichTextEditorAllModule,
    DatePickerModule,
    AccordionModule,
    ToolbarModule,
    NumericTextBoxModule,
    ChipListModule,
    MultiSelectModuleEj2,
    DateRangePickerModule,
    BreadcrumbModule,
  ],
})
export class SharedLibsModule {}
