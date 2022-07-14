import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IOrganizationFinancial } from './organization-financial.model';
import { OrganizationFinancialService } from './organization-financial.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { IDataOptions, PivotView, CellEditSettings, BeginDrillThroughEventArgs } from '@syncfusion/ej2-angular-pivotview';
import { data1 } from './datasource';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import { SelectEventArgs } from '@syncfusion/ej2-angular-dropdowns';

// import { Pivot_Data } from './datasource.ts';
@Component({
  selector: 'jhi-organization-financial',
  templateUrl: './organization-financial.component.html',
  styleUrls: ['../../../content/scss/vendor.scss', './organization.css'],
})
export class OrganizationFinancialComponent extends AbstractEntityComponent<IOrganizationFinancial> {
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  selectedProjection?: [];
  constructor(
    protected organizationFinancialService: OrganizationFinancialService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected modalService: NgbModal,
    protected confirmationService: ConfirmationService,
    private location: Location
  ) {
    super(
      organizationFinancialService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.parentRoute = '/organization-financial';
    this.listChangeEventName = 'organizationFinancialListModification';
    this.entityKeyName = 'id';

    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
      activatedRoute.queryParams.subscribe(params => {
        this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
        this.first = (this.page - 1) * this.itemsPerPage || 0;
      });
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  trackId(index: number, item: IOrganizationFinancial) {
    return item.id;
  }

  public selected: boolean;
  fa(args: SelectEventArgs) {
    this.selected = !this.selected;
  }

  public data1: object[] = data1;

  // get organizationFinancials() {
  //   return this.data1;
  // }

  set organizationFinancials(organizationFinancial: IOrganizationFinancial[]) {
    this.items = organizationFinancial;
  }

  public BlodType: string[] = ['Total Exposure > IDR 15 Bn', 'Total Exposure < IDR 15 Bn'];
  public path: Object = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
  };

  onUploadFile(event: any) {
    const files: FileList = event.target.files;

    if (files.length > 0) {
      const formData: FormData = new FormData();
      formData.append('file', files[0], files[0].name);
      this.itemService.uploadFile(formData).subscribe(res => {
        this.inputFile.nativeElement.value = null;
        this.itemService.process({ fileName: res.body.fileName }, { processName: 'processUploadFile' }).subscribe(() => {
          this.eventManager.broadcast({ name: this.listChangeEventName, content: 'Completed upload data' });
          this.messageService.add({ severity: 'info', summary: 'Upload Done', detail: 'Upload ' + res.body.fileName + ' done process' });
        });
      });
    }
  }

  downloadFile(name: string) {
    this.itemService
      .process(
        {
          fileName: name,
          header: 'id',
          fields: 'id',
        },
        { processName: 'buildDownloadFile' }
      )
      .subscribe(() => {
        this.itemService.downloadFile(name).subscribe(res => {
          const blobFileName = name;
          const blob = new Blob([res.body], { type: 'application/octet-stream' });
          saveAs(blob, blobFileName);
        });
      });
  }

  public onUploadSuccess(args: any): void {
    if (args.operation === 'upload') {
      console.log('File uploaded successfully');
    }
  }
  public onUploadFailure(args: any): void {
    console.log('File failed to upload');
  }

  selectProjection(): void {
    this.selectedProjection;
  }

  back(): void {
    this.location.back();
  }
}
