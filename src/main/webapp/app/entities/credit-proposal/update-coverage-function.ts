import { Router } from '@angular/router';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { ICreditProposal } from './credit-proposal.model';
import lodash, { filter } from 'lodash';
import { CreditProposalService } from './credit-proposal.service';
import { Injectable } from '@angular/core';
import { CollateralService } from '../collateral/collateral.service';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { ICollateral } from '../collateral/collateral.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateCoverageSummary {
  constructor(private router: Router, private creditProposalService: CreditProposalService, private collateralService: CollateralService) {}

  public biddingValueCoverage: number;
  public collateralProperties: ICollateralProperty[];
  public creditProposal: ICreditProposal;
  public creditProposalStartState: ICreditProposal;
  public dataCollateralSummary: any[];
  public totalPlafond: number;
  public biddingValueSum: number;

  public updateCoverage(
    creditProposal: ICreditProposal,
    creditProposalStartState: ICreditProposal,
    collateralProperties: ICollateralProperty[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('update summary run');
      this.creditProposal = creditProposal;
      this.creditProposalStartState = creditProposalStartState;
      this.collateralProperties = collateralProperties;

      // save after close dialog, for update summery report coverage
      this.save().then(() => {
        this.loadSummaryCollateralSummary().then(() => {
          this.getSummaryCollateral().then(() => {
            this.presentageSummary(String(this.countTotalMVSummary() / this.totalPlafond), 'mv');
            this.presentageSummary(String(this.countTotalLVSummary() / this.totalPlafond), 'lv');
            this.presentageSummary(String(this.countTotalMVKJJPSummary() / this.totalPlafond), 'mvKjjp');
            this.presentageSummary(String(this.countTotalLVKJJPSummary() / this.totalPlafond), 'lvKjjp');
            this.save().then(() => {
              resolve();
            });
          });
        });
      });
    });
  }

  private convertDate(date: any): any {
    if (typeof date === 'string') {
      let tempDate = '';
      const pointerDate = date.substring(11, 1);

      if (pointerDate === 'T') {
        tempDate = date.split('T')[0];
      }

      const newD = new Date(tempDate);
      const utcDate = new Date(Date.UTC(newD.getFullYear(), newD.getMonth(), newD.getDate(), newD.getHours(), newD.getMinutes()));
      return utcDate;
    } else {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
      return utcDate;
    }
  }
  public save(): Promise<void> {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);
    return new Promise((resolve, reject) => {
      this.creditProposalService.update(this.preSave('not-complate')).subscribe(
        res => {
          this.creditProposal.collateralProductRelations = res.body.collateralProductRelations;
          resolve(); // Panggil resolve() saat proses selesai
        },
        error => {
          reject(error); // Panggil reject() jika terjadi kesalahan
        }
      );
    });
  }

  private preSave(status: string): ICreditProposal {
    for (let i = 0; i < this.creditProposalService.partySliks.length; i++) {
      this.creditProposal.sliks = [...this.creditProposal.sliks, this.creditProposalService.partySliks[i]];
    }
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);

    if (this.router.url.split('/')[1] === 'credit-proposal-status') {
      if (copyCreditProposal.attributes.businessActivity.visitDate) {
        if (typeof copyCreditProposal.attributes.businessActivity.visitDate === 'object') {
          copyCreditProposal.attributes.businessActivity.visitDate = this.convertDate(
            copyCreditProposal.attributes.businessActivity.visitDate
          );
        }
      }
    }

    copyCreditProposal.attributes['collateralSummary'] = JSON.stringify(copyCreditProposal.attributes['collateralSummary']);
    copyCreditProposal.attributes['businessGroup'] = JSON.stringify(copyCreditProposal.attributes['businessGroup']);
    copyCreditProposal.attributes['shareHolder'] = JSON.stringify(copyCreditProposal.attributes['shareHolder']);
    copyCreditProposal.attributes['correspondence'] = JSON.stringify(copyCreditProposal.attributes['correspondence']);
    copyCreditProposal.attributes['basicInformation'] = JSON.stringify(copyCreditProposal.attributes['basicInformation']);
    copyCreditProposal.attributes['guaranturAnalysis'] = JSON.stringify(copyCreditProposal.attributes['guaranturAnalysis']);
    copyCreditProposal.attributes['riksCriteria'] = JSON.stringify(copyCreditProposal.attributes['riksCriteria']);
    copyCreditProposal.attributes['convenant'] = JSON.stringify(copyCreditProposal.attributes['convenant']);
    copyCreditProposal.attributes['creditProposalParent'] = JSON.stringify(copyCreditProposal.attributes['creditProposalParent']);
    copyCreditProposal.attributes['businessActivity'] = JSON.stringify(copyCreditProposal.attributes['businessActivity']);
    copyCreditProposal.attributes['analysisOfCalculation'] = JSON.stringify(copyCreditProposal.attributes['analysisOfCalculation']);
    copyCreditProposal.attributes['bankAnalyst'] = JSON.stringify(copyCreditProposal.attributes['bankAnalyst']);
    copyCreditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(copyCreditProposal.attributes['proformaLaporanKeuangan']);
    copyCreditProposal.attributes['tabSummary'] = JSON.stringify(copyCreditProposal.attributes['tabSummary']);
    copyCreditProposal.attributes['insurance'] = JSON.stringify(copyCreditProposal.attributes['insurance']);
    copyCreditProposal.attributes['binding'] = JSON.stringify(copyCreditProposal.attributes['binding']);
    copyCreditProposal.debtorData.attributes['prospectPerson'] = JSON.stringify(copyCreditProposal.debtorData.attributes['prospectPerson']);
    copyCreditProposal.attributes['repaymentCapability'] = JSON.stringify(copyCreditProposal.attributes['repaymentCapability']);
    copyCreditProposal.attributes['facilityDetail'] = JSON.stringify(this.creditProposal.attributes['facilityDetail']);
    copyCreditProposal.attributes['opinionHistory'] = JSON.stringify(this.creditProposal.attributes['opinionHistory']);
    copyCreditProposal.attributes['tabCustomer'] = JSON.stringify(this.creditProposal.attributes['tabCustomer']);
    copyCreditProposal.attributes['tradeCheckingSupplier'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingSupplier']);
    copyCreditProposal.attributes['tradeCheckingBuyers'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingBuyers']);
    copyCreditProposal.attributes['tradeCheckingRemarks'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingRemarks']);
    copyCreditProposal.attributes['collateralChecklist'] = JSON.stringify(this.creditProposal.attributes['collateralChecklist']);
    copyCreditProposal.attributes['tabSummaryMessage'] = JSON.stringify(this.creditProposal.attributes['tabSummaryMessage']);
    copyCreditProposal.attributes['managementInfo'] = JSON.stringify(this.creditProposal.attributes['managementInfo']);
    copyCreditProposal.attributes['purposePricing'] = JSON.stringify(copyCreditProposal.attributes['purposePricing']);
    copyCreditProposal.attributes['cpRacBelow'] = JSON.stringify(copyCreditProposal.attributes['cpRacBelow']);
    copyCreditProposal.attributes['cpRacBack'] = JSON.stringify(copyCreditProposal.attributes['cpRacBack']);
    copyCreditProposal.attributes['emptyField'] = JSON.stringify(copyCreditProposal.attributes['emptyField']);
    copyCreditProposal.attributes['collateralPrevious'] = JSON.stringify(copyCreditProposal.attributes['collateralPrevious']);
    copyCreditProposal.attributes['facilityTakeOver'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOver']);
    copyCreditProposal.attributes['facilityTakeOverAfterBank'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOverAfterBank']);
    copyCreditProposal.attributes['complienceReccomendation'] = JSON.stringify(copyCreditProposal.attributes['complienceReccomendation']);
    copyCreditProposal.attributes['industryLimit'] = JSON.stringify(copyCreditProposal.attributes['industryLimit']);
    copyCreditProposal.attributes['offeringLetter'] = JSON.stringify(copyCreditProposal.attributes['offeringLetter']);
    copyCreditProposal.attributes['bankAnalystMessage'] = JSON.stringify(copyCreditProposal.attributes['bankAnalystMessage']);
    copyCreditProposal.attributes['previous'] = JSON.stringify(copyCreditProposal.attributes['previous']);
    copyCreditProposal.attributes['offeringLetterPreparation'] = JSON.stringify(copyCreditProposal.attributes['offeringLetterPreparation']);
    copyCreditProposal.attributes['creditProposalCollateralData'] = JSON.stringify(
      copyCreditProposal.attributes['creditProposalCollateralData']
    );
    copyCreditProposal.attributes['retriveData'] = JSON.stringify(copyCreditProposal.attributes['retriveData']);
    copyCreditProposal.attributes['remarksFinancialStatement'] = JSON.stringify(
      this.creditProposal.attributes['remarksFinancialStatement']
    );
    copyCreditProposal.attributes['rejectReason'] = JSON.stringify(copyCreditProposal.attributes['rejectReason']);
    copyCreditProposal.attributes['legalLendingLimit'] = JSON.stringify(copyCreditProposal.attributes['legalLendingLimit']);
    copyCreditProposal.attributes['calculationExposure'] = JSON.stringify(copyCreditProposal.attributes['calculationExposure']);
    copyCreditProposal.groupProducts = [];
    copyCreditProposal.attributes['approvalStatus'] = JSON.stringify(copyCreditProposal.attributes['approvalStatus']);
    copyCreditProposal.attributes['dataAssignTo'] = JSON.stringify(copyCreditProposal.attributes['dataAssignTo']);
    copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCRO']);
    copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCCAdmin']);
    copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    copyCreditProposal.attributes['coverageTotal'] = JSON.stringify(copyCreditProposal.attributes['coverageTotal']);
    copyCreditProposal.attributes['lendingProgramParameter'] = JSON.stringify(copyCreditProposal.attributes['lendingProgramParameter']);
    copyCreditProposal.attributes['collateralGroup'] = JSON.stringify(copyCreditProposal.attributes['collateralGroup']);
    copyCreditProposal.attributes['dataAssignToDPPKReview1'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToDPPKReview1']);
    copyCreditProposal.attributes['dataAssignToDPPKReview2'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToDPPKReview2']);
    if (copyCreditProposal.prospectPerson) {
      copyCreditProposal.prospectPerson.dob = this.creditProposalStartState.prospectPerson.dob;
    }

    if (copyCreditProposal.attributes['legalCovernote']) {
      if (typeof copyCreditProposal.attributes['legalCovernote'] !== 'string') {
        copyCreditProposal.attributes['legalCovernote'] = JSON.stringify(copyCreditProposal.attributes['legalCovernote']);
      }
    }

    return copyCreditProposal;
  }

  private loadSummaryCollateralSummary(): Promise<void> {
    return new Promise((resolve, reject) => {
      const applicationNumber = this.creditProposal.id;
      this.collateralService.getSummaryCollateral(applicationNumber, { page: 0, size: 9999 }).subscribe(
        res => {
          this.dataCollateralSummary = lodash.filter(res.body, function (o) {
            return o.statusId !== STATUS_COLLATERAL.CANCEL && o.statusId !== STATUS_COLLATERAL.RELEASE;
          });
          if (res.body.length > 0) {
            this.getBindingCalculateSummary(this.dataCollateralSummary).then(() => {
              resolve();
            });
          } else {
            resolve();
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  public getBindingCalculateSummary(res: any[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const array1 = res;
      const array2 = this.creditProposal.attributes['binding'];
      let getBindingCalculateValue;
      const data = [];
      array1.filter(({ id: value1, collateralTypeId: collateralTypeId }) => {
        data.push(array2.find(({ collateralId: value2 }) => value1 === value2 && collateralTypeId !== 'CORPORATEPERSONALGUARANTEE'));
        getBindingCalculateValue = data.filter(item => item !== undefined);
        this.fungsiSumcredit('both')
          .then(() => {
            const biddingValueSum = getBindingCalculateValue.reduce((a: any, b: any) => a + Number(b.bindingValueEqIdr), 0);
            const biddingValueCoverage = this.convertNan(Number(biddingValueSum) / Number(this.totalPlafond));
            this.creditProposal.attributes['collateralSummary'].biddingValueCoverage = biddingValueCoverage.toFixed(2);
            resolve(); // Resolve the promise when the operation completes
          })
          .catch((error: any) => {
            reject(error); // Reject the promise if there is an error
          });
      });
    });
  }

  fungsiSumcredit(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let result: number;
      let dolar: number;
      let filterIdr = [];
      let filterUsd = [];
      result = 0;
      dolar = 0;

      const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

      if (dataFilter.length > 0) {
        if (value === 'USD' || value === 'both') {
          filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
        }

        if (value === 'IDR' || value === 'both') {
          filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
        }

        if (value === 'IDR' || value === 'both') {
          if (filterIdr.length > 0) {
            for (let i = 0; i < filterIdr.length; i++) {
              if (filterIdr[i].totalPlafond !== undefined) {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
          }
        }

        if (value === 'USD') {
          if (filterUsd.length > 0) {
            for (let i = 0; i < filterUsd.length; i++) {
              if (filterUsd[i].totalPlafond !== undefined) {
                dolar = dolar + Number(filterUsd[i].totalPlafond);
              }
            }
          }
        }

        if (value === 'both') {
          if (filterUsd.length > 0) {
            for (let i = 0; i < filterUsd.length; i++) {
              if (filterUsd[i].totalPlafond !== undefined) {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
          }
        }
      }
      if (value === 'both') {
        this.creditProposal.attributes['facilityDetail'].totalPlafond = result + dolar;
      }
      if (value === 'USD') {
        this.creditProposal.attributes['facilityDetail'].totalPlafondUsd = result + dolar;
      }
      if (value === 'IDR') {
        this.creditProposal.attributes['facilityDetail'].totalPlafondIdr = result + dolar;
      }

      const creditLimit = result + dolar;
      this.creditProposal.attributes['coverageTotal'].creditLimit = creditLimit;

      this.totalPlafond = result + dolar;

      resolve();
    });
  }

  public convertNan(value: any): any {
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }
  }

  public getSummaryCollateral() {
    return new Promise((resolve, reject) => {
      const applicationNumber = this.creditProposal.id;
      this.collateralService.getSummaryCollateral(applicationNumber, { page: 0, size: 9999 }).subscribe(
        res => {
          this.dataCollateralSummary = lodash.filter(res.body, function (o) {
            return o.statusId !== STATUS_COLLATERAL.CANCEL && o.statusId !== STATUS_COLLATERAL.RELEASE;
          });
          resolve(this.dataCollateralSummary);
        },
        error => {
          reject(error);
        }
      );
    });
  }
  public getBindingCalculate(res: any[]) {
    const array1 = res;
    const array2 = this.creditProposal.attributes['binding'];
    let getBindingCalculateValue;
    const data = [];
    array1.filter(({ id: value1, collateralTypeId: collateralTypeId }) => {
      data.push(array2.find(({ collateralId: value2 }) => value1 === value2 && collateralTypeId !== 'CORPORATEPERSONALGUARANTEE'));
      getBindingCalculateValue = data.filter(item => item !== undefined);
      this.fungsiSumcredit('both').then(() => {
        this.biddingValueSum = getBindingCalculateValue.reduce((a: any, b: any) => a + Number(b.bindingValueEqIdr), 0);
        const biddingValueCoverage = this.convertNan(Number(this.biddingValueSum) / Number(this.totalPlafond));

        this.biddingValueCoverage = Math.round(biddingValueCoverage * 100) / 100;
        this.creditProposal.attributes['coverageTotal'].biddingValueSum = this.biddingValueSum;
        this.creditProposal.attributes['coverageTotal'].biddingValueCoverage = this.biddingValueCoverage;

        this.presentageSummary(String(this.countTotalMVSummary() / this.totalPlafond), 'mv');
        this.presentageSummary(String(this.countTotalLVSummary() / this.totalPlafond), 'lv');
        this.presentageSummary(String(this.countTotalMVKJJPSummary() / this.totalPlafond), 'mvKjjp');
        this.presentageSummary(String(this.countTotalLVKJJPSummary() / this.totalPlafond), 'lvKjjp');
      });
    });
  }

  public countTotalMVSummary(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateralSummary;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);
          if (data !== undefined) {
            result = result + Number(data.marketValue);
          }
        }
      }
    }
    this.creditProposal.attributes['collateralSummary'].countTotalMV = result;
    return result;
  }

  public countTotalLVSummary(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateralSummary;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);

          if (data !== undefined) {
            result = result + Number(data.liquidationValue);
          }
        }
      }
    }

    this.creditProposal.attributes['collateralSummary'].countTotalLV = result;
    return result;
  }

  public countTotalMVKJJPSummary() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateralSummary;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined && collaterals[i].collateralTypeId) {
            result = result + data.marketValue;
          }
        }
      }
    }
    this.creditProposal.attributes['collateralSummary'].countTotalMVKJJP = result;
    return result;
  }

  public countTotalLVKJJPSummary() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateralSummary;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined) {
            result = result + data.liquidationValue;
          }
        }
      }
    }
    this.creditProposal.attributes['collateralSummary'].countTotalLVKJJP = result;
    return result;
  }

  private filterPropertiesFilterGurante(collateral: ICollateral): ICollateralProperty[] {
    let properties: ICollateralProperty[];
    properties = [];

    // for machine
    if (collateral.collateralTypeId !== 'CORPORATEPERSONALGUARANTEE') {
      if (collateral.collateralTypeId !== '' || collateral.collateralTypeId !== undefined) {
        properties = lodash.filter(this.collateralProperties, function (o) {
          return o.propertyType === 'GENERAL' && o.collateralId === collateral.id;
        });
      }
    }

    return properties;
  }

  public presentageSummary(value: string, status: string) {
    const num = parseFloat(value).toFixed(2);
    if (num === 'Infinity') {
      if (status === 'mv') {
        this.creditProposal.attributes.collateralSummary.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.collateralSummary.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else if (num === 'NaN') {
      if (status === 'mv') {
        this.creditProposal.attributes.collateralSummary.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.collateralSummary.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else {
      if (status === 'mv') {
        this.creditProposal.attributes.collateralSummary.mvInternalCoverage = num;
      } else if (status === 'lv') {
        this.creditProposal.attributes.collateralSummary.lvInternalCoverage = num;
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = num;
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = num;
      }
      return num + 'x';
    }
  }
}
