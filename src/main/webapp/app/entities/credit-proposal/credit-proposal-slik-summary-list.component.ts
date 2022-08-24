import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmitType } from '@syncfusion/ej2-base';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { HttpResponse } from '@angular/common/http';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { ColumnModel, GridComponent, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';
import { IPartySlik } from '../party-slik/party-slik.model';
import { CssSelector } from '@angular/compiler';
import { style } from '@angular/animations';

@Component({
  selector: 'jhi-credit-proposal-slik-summary',
  templateUrl: './credit-proposal-slik-summary-list.component.html',
  // styleUrls: ['../layout-css/layout-css-template.css'],
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalListSlikSummaryListComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  @ViewChild('ejDialog')
  ejDialog: DialogComponent;
  public grid: GridComponent;
  public dialogVisible: boolean;
  public width?: string;
  public height?: string;
  public animationSettings?: Object;

  public partyId: string;
  public dataSlik?: IPartySlik[] = [];

  constructor(
    protected creditProposalService: CreditProposalService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected modalService: NgbModal,
    protected confirmationService: ConfirmationService
  ) {
    super(
      creditProposalService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );
    this.width = '90%';
    this.height = '90%';
    this.dialogVisible = false;
    this.animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

    this.parentRoute = '/credit-proposal';
    this.listChangeEventName = 'creditProposalListModification';
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

  onOpen(args: any) {
    args.preventFocus = true;
  }

  public onOpenDialog(): void {
    this.ejDialog.show();
  }

  public onhideClick(): void {
    this.ejDialog.hide();
  }

  public data: any = [
    {
      indexNum: 1,
      name: 'Testing',
      bank: 'John',
      limit: 'Manager',
      os: 'android',
      facilityType: 'tes',
      rate: '6 %',
      period: '2022',
      type: 'tes',
      idrMio: 'RP 50.000.000.000',
      tenor: '10 bln',
      kolTerakhir: '11',
      kolTerburuk: '15',
      restrukturasi: 'tes',
    },
    {
      indexNum: 2,
      name: 'Testing 2',
      bank: 'John 2',
      limit: 'Manager 2',
      os: 'android 2',
      facilityType: 'tes 2',
      rate: '10 %',
      period: '2022',
      type: 'tes 2',
      idrMio: 'RP 100.000.000.000',
      tenor: '12 bln',
      kolTerakhir: '10',
      kolTerburuk: '15',
      restrukturasi: 'tes 2',
    },
  ];

  public collateralColumns: ColumnModel[] = [
    {
      field: 'type',
      headerText: 'Type',
      width: 200,
      textAlign: 'Left',
      headerTextAlign: 'Center',
      customAttributes: { class: 'e-attr' },
    },
    {
      field: 'idrMio',
      headerText: 'IDR Mio',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
      customAttributes: { class: 'e-attr' },
    },
  ];

  public comparison: any = [
    {
      number: 1,
      bank: 'BCA',
      limitPrev: 'Rp. 50.000.000',
      balancePrev: 'Rp. 100.000.000',
      limitCur: 'Rp. 55.000.000',
      balanceCur: 'Rp. 110.000.000',
    },
  ];

  public previous: ColumnModel[] = [
    {
      field: 'limitPrev',
      headerText: 'Limit',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
    {
      field: 'balancePrev',
      headerText: 'Balance',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
  ];

  public current: ColumnModel[] = [
    {
      field: 'limitCur',
      headerText: 'Limit',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
    {
      field: 'balanceCur',
      headerText: 'Balance',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
  ];

  public focusOut(target: HTMLElement): void {
    target.parentElement.classList.remove('e-input-focus');
  }
  // rowSelected(args: RowSelectEventArgs) {
  //   const selectedrowindex: number[] = this.grid.getSelectedRowIndexes(); // Get the selected row indexes.
  //   alert(selectedrowindex); // To alert the selected row indexes.
  //   const selectedrecords: object[] = this.grid.getSelectedRecords(); // Get the selected records.
  // }

  // public findSlik(): void {
  //   this.creditProposalService.findBySlik(this.partyId).subscribe((res: HttpResponse<ICreditProposal>) => {
  //     const result: ICreditProposal = res.body;
  //     if (result) {
  //       const redirectUri = '/credit-proposal/' + result[0].id + '/detail';
  //       this.router.navigate([redirectUri]);
  //     }
  //   });
  // }
}
