// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild, ViewContainerRef, Inject, AfterViewInit, TemplateRef } from '@angular/core';
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
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-collateral-appraisal',
  templateUrl: './collateral-appraisal.component.html',
  styleUrls: ['./css/appraisal-component.css'],
})
export class CollateralAppraisalComponent implements OnInit, AfterViewInit {
  public item: ICollateralAppraisal[] = [];
  public pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 2, pageSize: 5 };

  @ViewChild('childtemplate', { static: true }) public childtemplate: any;
  @ViewChild('grid') public grid: GridComponent;
  public childGrid: any;

  constructor(private viewContainerRef: ViewContainerRef, protected collateralAppraisalService: CollateralAppraisalService) {}

  ngAfterViewInit() {
    console.log(this.viewContainerRef);
    this.childtemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplate.elementRef.nativeElement.propName = 'template';
  }
  ngOnInit(): void {
    this.getCollateralApraisall();
    this.childGrid = {
      dataSource: this.dataChild,
      queryString: 'parent',
      allowPaging: true,
      class: 'border',
      pageSettings: { pageSize: 3, pageCount: 3 },
      editSettings: { template: this.childtemplate },
      load() {
        this.registeredTemplate = {}; // set registertemplate value as empty in load event
      },
      columns: [
        { field: 'no', headerText: 'No', textAlign: 'Right', width: 120 },
        { field: 'jenisJM', headerText: 'Jenis Jaminan', width: 120 },
        { field: 'alamat', headerText: 'Alamat', width: 120 },
        { field: 'kota', headerText: 'Kota', width: 120 },
        { field: 'jenisObj', headerText: 'Jenis Objek', width: 120 },
        { field: 'jenisPerm', headerText: 'Penis Permohonan', width: 120 },
        { field: 'tipeOfc', headerText: 'Status', width: 120 },
        { headerText: 'Action', template: this.childtemplate, width: 150 },
      ],
    };
  }

  getCollateralApraisall() {
    this.collateralAppraisalService.query().subscribe((res: HttpResponse<ICollateralAppraisal[]>) => {
      this.item = res.body;
    });
  }
  public dataUtama: object[] = [
    {
      id: 1,
      parent: '001',
      tipe: 'INDIVIDU',
      namaDebitur: 'KRISNA SN',
      nik: '3201904859',
      segmenProduct: 'SME',
      status: 'Draft',
    },
    {
      id: 2,
      parent: '002',
      tipe: 'INDIVIDU',
      namaDebitur: 'KRISNA SN',
      nik: '3201904859',
      segmenProduct: 'SME',
      status: 'Draft',
    },
    {
      id: 3,
      parent: '003',
      tipe: 'INDIVIDU',
      namaDebitur: 'KRISNA SN',
      nik: '3201904859',
      segmenProduct: 'SME',
      status: 'Draft',
    },
  ];

  public dataChild: object[] = [
    {
      no: 1,
      parent: '001',
      jenisJm: 'Pabrik',
      alamat: 'Industri Raya 10D-8',
      kota: 'Surabaya',
      jenisObj: 'Baru',
      jenisPerm: 'Renewal',
      tipeOfc: 'internal',
    },
    {
      no: 1,
      jenisJm: 'Pabrik',
      parent: '001',
      alamat: 'Industri Raya 10D-8',
      kota: 'Surabaya',
      jenisObj: 'Baru',
      jenisPerm: 'Renewal',
      tipeOfc: 'internal',
    },
    {
      no: 1,
      jenisJm: 'Pabrik',
      parent: '002',
      alamat: 'Industri Raya 10D-8',
      kota: 'Surabaya',
      jenisObj: 'Baru',
      jenisPerm: 'Renewal',
      tipeOfc: 'internal',
    },
  ];

  print() {
    console.log(this.item);
  }
}
