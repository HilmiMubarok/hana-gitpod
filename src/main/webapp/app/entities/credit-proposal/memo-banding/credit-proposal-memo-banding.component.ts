import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import _ from 'lodash';
import { CpMemoBandingService } from './services/cp-memo-banding.service';

@Component({
  selector: 'jhi-credit-proposal-memo-banding',
  templateUrl: './credit-proposal-memo-banding.component.html',
})
export class MemoBandingComponent implements OnInit {
  constructor(private cpMemoBandingService: CpMemoBandingService) {}

  ngOnInit(): void {
    this.cpMemoBandingService.compareDeepData(this.d1, this.d2);
  }
  @Input() creditProposal: ICreditProposal;

  public loanFacilityData: unknown;
  public collateralData: unknown;
  public convenantData: unknown;

  /**
   * steps for compare data
   * 1. get data from creditProposal.products / creditProposal.collaterals / creditProposal.attributes['covenants'] => the current data (data1)
   * 2. get data from creditProposal.attributes['previousOfferingLetter'] => next data (data2)
   * 3. compare data1 and data2 using lodash
   * 4. if result is false, then add key 'isChanged' to changed data, add key 'isRemoved' to removed data, and add key 'noChanged' to no changed data
   * 5. assign data to loanFacilityData, collateralData, and convenantData. use this data to show in html
   */

  public d1 = [
    {
      id: 1,
      name: 'john',
      age: 24,
    },
    {
      id: 2,
      name: 'Doe',
      age: 24,
    },
    {
      id: 3,
      name: 'John Doe',
      age: 24,
    },
  ];

  public d2 = [
    {
      id: 1,
      name: 'john',
      age: 24,
    },
    {
      id: 4,
      name: 'Jane Doe',
      age: 24,
    },
    {
      id: 2,
      name: 'Doe',
      age: 25,
    },
  ];
}
