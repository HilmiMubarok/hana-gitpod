import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { ICollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';

import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';
import { PartyCifService } from '../party-cif/party-cif.service';

@Component({
  selector: 'jhi-collateral-appraisal',
  templateUrl: './collateral-appraisal.component.html',
})
export class CollateralAppraisalComponent implements OnInit {
  // @ViewChild('childtemplate', { static: true }) public childtemplate: any;
  public parentData: Object[];
  public childGrid: any;

  constructor(private partyCifService: PartyCifService) {}

  ngOnInit(): void {
    this.parentData = [];
    /* this.childGrid = {
      dataSource: [],
      queryString: 'partyId',
	  editSettings: { template: this.childtemplate },
	  load() {
        this.registeredTemplate = {};
      },
      class: 'border',
      columns: [
        { field: 'id', headerText: 'No', textAlign: 'Right', width: 120 },
        { field: 'jenisJm', headerText: 'Jenis Jaminan', width: 120 },
        { field: 'alamat', headerText: 'Alamat', width: 120 },
        { field: 'kota', headerText: 'Kota', width: 120 },
        { field: 'jenisObj', headerText: 'Jenis Objek', width: 120 },
        { field: 'jenisPerm', headerText: 'Penis Permohonan', width: 120 },
        { field: 'tipeOfc', headerText: 'Tipe Officer', width: 120 },
		{ template: this.childtemplate, headerText: 'Action', width: 150 }
      ],
    };*/

    this.childGrid = {
      dataSource: [],
      queryString: 'partyId',
      class: 'border',
      columns: [
        { field: 'id', headerText: 'No', textAlign: 'Right', width: 120 },
        { field: 'jenisJm', headerText: 'Jenis Jaminan', width: 120 },
        { field: 'alamat', headerText: 'Alamat', width: 120 },
        { field: 'kota', headerText: 'Kota', width: 120 },
        { field: 'jenisObj', headerText: 'Jenis Objek', width: 120 },
        { field: 'jenisPerm', headerText: 'Penis Permohonan', width: 120 },
        { field: 'tipeOfc', headerText: 'Tipe Officer', width: 120 },
      ],
    };

    this.partyCifService.search().subscribe((res: HttpResponse<any[]>) => {
      console.log('res.body party-cif: ', res.body);
      this.parentData = res.body;

      for (let a = 0; a < res.body.length; a++) {
        for (let b = 0; b < res.body[a]['collaterals'].length; b++) {
          this.childGrid.dataSource.push(res.body[a]['collaterals'][b]);
        }
      }
    });
  }

  goToEdit(ev: any): void {
    console.log('goToEdit');
  }
}
