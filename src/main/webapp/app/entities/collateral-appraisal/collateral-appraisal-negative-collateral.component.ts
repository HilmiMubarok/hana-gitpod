import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'jhi-collateral-appraisal-negative-collateral',
  templateUrl: './collateral-appraisal-negative-collateral.component.html',
})
export class CollateralAppraisalNegativeCollateralComponent extends AbstractEntityComponent<ICollateralAppraisal> implements OnInit {
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

  public data: object[];

  ngOnInit(): void {
    this.data = data;
  }
}

export const data: Object[] = [
  {
    No: 1,
    Criteria: 'Masuk Gang atau lebar jalan < 3 meter.',
    Verified: !0,
    value: 'gang',
  },
  {
    No: 2,
    Criteria: 'Hasil site visit, survey, trade checking, dan verifikasi perihal usaha debitur ke rumah dan usaha positif.',
    Verified: !2,
    value: 'p',
  },
  {
    No: 3,
    Criteria: 'Berada dekat induk gardu listrik atau saluran udara tegangan ekstra tinggi (SUTET) dengan jarak \u{2264} 50 meter.',
    Verified: !3,
  },
  {
    No: 4,
    Criteria: 'Terkena banjir (hingga masuk ke dalam property/asset yang menjadi jaminan) setiap menjadi hujan besar.',
    Verified: !4,
  },
  {
    No: 5,
    Criteria: 'Ada rencana tata kota yang akan menyebabkan terjadinya penggusuran property/asset yang menjadi jaminan.',
    Verified: !5,
  },
  {
    No: 6,
    Criteria:
      'Dijadikan rumah ibadah, sekolah, panti jompo, panti asuhan, rumah duka, rumah sakit atau prasarana lain yang bersifat sosial kemanusiaan.',
    Verified: !6,
  },
  {
    No: 7,
    Criteria: 'Berlokasi dekat pemakaman umum (berjarak \u{2264} 200 meter).',
    Verified: !7,
  },
  {
    No: 8,
    Criteria: 'Berlokasi dekat dengan Tempat Pembuangan Sampah Akhir (TPA) dengan jarak \u{2264} 1 km.',
    Verified: !8,
  },
  {
    No: 9,
    Criteria: 'Diginakan dan atau diperuntukan (zoning) sebagai sawah/ladang/pertanian/rawa-rawa.',
    Verified: !9,
  },
  {
    No: 10,
    Criteria: 'Jaminan merupakan kawasan cagar budaya.',
    Verified: !10,
  },
  {
    No: 11,
    Criteria: 'SHM atau HGB atau SHMSRS di atas Hak Pengelolaan.',
    Verified: !11,
  },
  {
    No: 12,
    Criteria:
      'Sebagian area tanahnya digunakan untuk mendirikan Base Transceiver Station atau BTS (tidak termasuk BTS yang didirikan diatas bangunan).',
    Verified: !12,
  },
  {
    No: 13,
    Criteria: 'Rumah sarang burung.',
    Verified: !13,
  },
  {
    No: 14,
    Criteria: 'HGB atau MoU di atas Hak Milik orang lain (Perumnas).',
    Verified: !14,
  },
  {
    No: 15,
    Criteria: 'Terletak di pinggir laut (bukan pantai) atau rel kereta api.',
    Verified: !15,
  },
];
