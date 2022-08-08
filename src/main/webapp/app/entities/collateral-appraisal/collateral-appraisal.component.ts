import { Component, ViewChild, OnInit, TemplateRef, ViewContainerRef, Inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import { ICollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';

import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';
import { PartyCifService } from '../party-cif/party-cif.service';

import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-collateral-appraisal',
  templateUrl: './collateral-appraisal.component.html',
})
export class CollateralAppraisalComponent implements OnInit, AfterViewInit {
  @ViewChild('childtemplate', { static: true }) public childtemplate: TemplateRef<{}>;
  public parentData: Object[];
  public childGrid: any;
  public pageSettings: PageSettingsModel = { pageCount: 2, pageSize: 5 };

  constructor(
    private partyCifService: PartyCifService,
    protected router: Router,
    @Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.parentData = [];
    this.childGrid = {
      dataSource: [],
      queryString: 'partyId',
      allowPaging: 'true',
      pageSettings: { pageCount: 2, pageSize: 5 },
      editSettings: { template: this.childtemplate },
      load() {
        this.registeredTemplate = {};
      },
      class: 'border',
      columns: [
        { field: 'id', headerText: 'No', textAlign: 'Right', width: 120 },
        { field: 'applicationId', headerText: 'No Request', width: 120 },
        { field: 'apprDate', headerText: 'Tanggal Request', width: 120 },
        { field: 'collateralTypeDescription', headerText: 'Tipe Collateral', width: 120 },
        { field: 'statusId', headerText: 'Status', width: 120 },
        { template: this.childtemplate, headerText: 'Action', width: 150 },
      ],
    };

    this.partyCifService.search().subscribe((res: HttpResponse<IPartyCif[]>) => {
      console.log('res.body party-cif: ', res.body);
      this.parentData = res.body;

      for (let a = 0; a < res.body.length; a++) {
        for (let b = 0; b < res.body[a]['collaterals'].length; b++) {
          this.childGrid.dataSource.push(res.body[a]['collaterals'][b]);

          for (let c = 0; c < this.childGrid.dataSource.length; c++) {
            for (let d = 0; d < res.body[a]['appraisals'].length; d++) {
              this.childGrid.dataSource[c]['applicationId'] = res.body[a]['appraisals'][d]['applicationId'];
              this.childGrid.dataSource[c]['apprDate'] = res.body[a]['appraisals'][d]['apprDate'];
              this.childGrid.dataSource[c]['statusId'] = res.body[a]['appraisals'][d]['statusId'];
            }
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    this.childtemplate.elementRef.nativeElement._viewContainerRef = this.viewContainerRef;
    this.childtemplate.elementRef.nativeElement.propName = 'template';
  }

  goToEdit(ev: any): void {
    this.router.navigate(['./collateral-appraisal/new']);
  }
}
