import { Injectable } from '@angular/core';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { statusCovenantNotRefreshedFromMaster } from './convenant.constant';

@Injectable({
  providedIn: 'root',
})
export class ConvenantService {
  constructor(private masterService: GeneralParameterService) {}
  dataGrid: any = [];
  creditProposal: any = {};

  getAttrName(type: string) {
    return this.creditProposal.attributes[type];
  }

  loadDataFromMaster(idParameterType: string) {
    return this.masterService.queryFilterBy({
      idParameterType,
      page: 0,
      size: 9999,
    });
  }

  syncDataFromMaster(idParameterType: string) {
    this.loadDataFromMaster(idParameterType).subscribe(res => {
      const data = lodash.filter(res.body, function (o) {
        return o.statusId === 'ACTIVE';
      });

      const gridData = [];
      for (let i = 0; i < data.length; i++) {
        const num = i;
        gridData[i] = { id: num, covenant: data[i].value, status: 'Applied', deviation: '', justification: '' };
      }
      this.dataGrid = gridData;

      if (!statusCovenantNotRefreshedFromMaster.includes(this.creditProposal.statusId)) {
      }
    });
  }
}
