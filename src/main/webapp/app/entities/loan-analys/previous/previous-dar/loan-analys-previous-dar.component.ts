import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { LoanAnalysService } from '../../loan-analys.service';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CompareDataService } from 'app/entities/compare-data/services/compare-data.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
@Component({
  selector: 'jhi-loan-analys-previous-dar',
  templateUrl: './loan-analys-previous-dar.component.html',
  styleUrls: ['../loan-analys-previous-dar.css'],
  styles: [
    `
      .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        margin-bottom: 30px;
      }

      .spinner {
        border: 14px solid #f3f3f3;
        border-radius: 50%;
        border-top: 14px solid #3498db;
        width: 100px;
        height: 100px;
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
      }

      @-webkit-keyframes spin {
        0% {
          -webkit-transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .text {
        margin-top: 38px;
        font-size: 22px;
        font-weight: bold;
        color: #3498db;
      }
    `,
  ],
})
export class LoanAnalysPreviousDarComponent implements OnInit, OnDestroy {
  public selectedMenu: string;
  public menuCovenant = 'COVENANT';
  public menuDeviation = 'DEVIATION';
  public dataToCompare: any;
  public isDataToCompareExist: Boolean = false;
  public collateral: ICollateral[] = [];
  public collateralProperties: ICollateralProperty[] = [];

  public menuItemsAll: MenuItemModel[] = [{ text: 'PREVIOUS DAR' }, { text: 'PREVIOUS PROPOSAL' }];

  public _creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;

  public loadingPreviousDar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  ngOnInit(): void {
    this.selectedMenu = 'PREVIOUS DAR';
    this.selectedMenu === 'PREVIOUS DAR' && this.getDarData();
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposal.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
    }
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  constructor(
    private loanAnalysService: LoanAnalysService,
    private collateralService: CollateralService,
    private collateralPropertyService: CollateralPropertyService,
    private compareDataService: CompareDataService,
    private cashCollateralService: CashCollateralService
  ) {}

  public getDarData() {
    this.loadingPreviousDar$.next(true);
    this.loanAnalysService
      .getLaDarCheckerNotif(this.creditProposal.customerId.toString(), {
        page: 0,
        size: 999,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => this.getDataToCompare(res.body),
        error: () => this.loadingPreviousDar$.next(false),
        // eslint-disable-next-line object-shorthand
        complete: () => {
          console.log('complete');
          this.isDataToCompareExist = true;
          this.loadingPreviousDar$.next(false);
        },
      });
  }

  public getDataToCompare(data: any) {
    // if data length === 0, then set this.dataToCompare = {}
    // if data length === 1, then set this.dataToCompare = data[0]
    // if data length > 1, then set this.dataToCompare = newest data by createdDate
    if (data.length === 0) {
      this.dataToCompare = {};
    } else {
      data.filter((item, index) => {
        if (index === 0) {
          this.dataToCompare = item;
          this.compareDataService.setCreditProposalPreviousDar(item);
        } else {
          if (item.createdDate > this.dataToCompare.createdDate) {
            this.dataToCompare = item;
            this.compareDataService.setCreditProposalPreviousDar(item);
          }
        }
      });
    }

    console.log('res', {
      ori: data,
      final: this.dataToCompare,
      isExist: this.isDataToCompareExist,
    });
  }

  public setMenu(value): void {
    this.selectedMenu = value.item.properties.text;
  }

  public onProposalTypeChange(value: any): void {
    this.setMenu(value.value);
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(param: ICreditProposal) {
    this._creditProposal = param;

    // Set compare data service cp
    this.compareDataService.setCreditProposal(param);
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.collateral = res.body;
      });
  }

  public findCollateralProperty(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];
    });
  }
}
