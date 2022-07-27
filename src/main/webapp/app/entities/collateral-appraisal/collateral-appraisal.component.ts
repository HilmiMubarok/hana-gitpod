import { Component, OnInit } from '@angular/core';
// import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
// import { DataChild, DataSample } from './data';

/* @Component({
  selector: 'jhi-collateral-appraisal',
  templateUrl: './collateral-appraisal.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})*/
@Component({
  selector: 'jhi-collateral-appraisal',
  templateUrl: './collateral-appraisal.component.html',
})
export class CollateralAppraisalComponent extends AbstractEntityComponent<ICollateralAppraisal> implements OnInit {
  // export class CollateralAppraisalComponent extends AbstractEntityComponent<ICollateralAppraisal> {
  public parentData: Object[];
  public childGrid: any;
  public secondChildGrid: any;

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

    this.parentRoute = '/collateral-appraisal';
    this.listChangeEventName = 'collateralAppraisalListModification';
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

  trackId(index: number, item: ICollateralAppraisal) {
    return item.id;
  }

  get collateralAppraisals() {
    return this.items;
  }

  set collateralAppraisals(collateralAppraisal: ICollateralAppraisal[]) {
    this.items = collateralAppraisal;
  }

  ngOnInit(): void {
    this.parentData = [
      {
        id: 1,
        relationID: 1,
        noCif: '0090',
        nik: '3201904859',
        namaDebitur: 'KRISNA SN',
        tipe: 'INDIVIDU',
        segmenProduct: 'SME',
        status: 'Draft',
        applicationId: 1,
        partyId: '00000013',
      },
      {
        id: 2,
        relationID: 2,
        noCif: '0090',
        nik: '3201904859',
        namaDebitur: 'KRISNA SN',
        tipe: 'INDIVIDU',
        segmenProduct: 'SME',
        status: 'Draft',
        applicationId: 1,
        partyId: '00000013',
      },
    ];
    this.childGrid = {
      dataSource: [
        {
          id: 1,
          relationID: 1,
          jenisJm: 'Pabrik',
          alamat: 'Industri Raya 10D-8',
          kota: 'Surabaya',
          jenisObj: 'Baru',
          jenisPerm: 'Renewal',
          tipeOfc: 'internal',
        },
        {
          id: 2,
          relationID: 1,
          jenisJm: 'Pabrik',
          alamat: 'Industri Raya 10D-8',
          kota: 'Surabaya',
          jenisObj: 'Baru',
          jenisPerm: 'Renewal',
          tipeOfc: 'internal',
        },
        {
          id: 3,
          relationID: 2,
          jenisJm: 'Pabrik',
          alamat: 'Industri Raya 10D-8',
          kota: 'Surabaya',
          jenisObj: 'Baru',
          jenisPerm: 'Renewal',
          tipeOfc: 'internal',
        },
      ],
      queryString: 'relationID',
      class: 'border',
      columns: [
        { field: 'no', headerText: 'No', textAlign: 'Right', width: 120 },
        { field: 'jenisJm', headerText: 'Jenis Jaminan', width: 120 },
        { field: 'alamat', headerText: 'Alamat', width: 120 },
        { field: 'kota', headerText: 'Kota', width: 120 },
        { field: 'jenisObj', headerText: 'Jenis Objek', width: 120 },
        { field: 'jenisPerm', headerText: 'Penis Permohonan', width: 120 },
        { field: 'tipeOfc', headerText: 'Tipe Officer', width: 120 },
      ],
    };
  }
}
