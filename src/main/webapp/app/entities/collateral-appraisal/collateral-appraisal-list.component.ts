import { Component, Input, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ICollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';

import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AccountService } from 'app/core/auth/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DialogComponent } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'jhi-collateral-appraisal-list',
  templateUrl: './collateral-appraisal-list.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalListComponent extends AbstractEntityEj2GridComponent<ICollateralAppraisal> {
  @Input() partyId: number;
  public data: any[];

  @ViewChild('template') template: DialogComponent;
  public dialogVisible: boolean;
  public width?: string;
  public height?: string;
  public animationSettings?: Object;

  constructor(
    protected collateralAppraisalService: CollateralAppraisalService,
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
      collateralAppraisalService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );
    this.width = '250px';
    this.height = '250px';
    this.dialogVisible = false;
    this.animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

    this.data = [
      {
        no: 1,
        jenisDetailJamian: 'Pabrik',
        alamat: 'Industry Raya10D-8',
        kota: 'Surabaya',
        jenisObject: 'Baru',
        jenisPermohonan: 'Renewal',
        tipeOfficerApprisal: 'Internal',
      },
      {
        no: 2,
        jenisDetailJamian: 'Ruko',
        alamat: 'Industry Raya10D-8',
        kota: 'Surabaya',
        jenisObject: 'Baru',
        jenisPermohonan: 'ReAppraisal',
        tipeOfficerApprisal: 'Internal',
      },
    ];
  }

  public onOpenDialog(): void {
    this.dialogVisible = true;
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }
}
