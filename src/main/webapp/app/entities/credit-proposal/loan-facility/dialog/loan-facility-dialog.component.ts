import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';

@Component({
  selector: 'jhi-loan-facility-dialog',
  templateUrl: './loan-facility-dialog.component.html',
})
export class CreditProposalLoanFacilityDialogComponent {
  public detailStats = false;
  public statIntRate = true;
  public listOfValue = {
    applicationTypeList: [
      'New',
      'Additional / Top Up',
      'Renewal',
      'Restructure',
      'Existing',
      'Others',
      'Renewal + Additional',
      'Renewal + Decrease',
    ],
    facilityTypeList: ['OD', 'WCI', 'DL', 'MML', 'FL', 'TR', 'E-ARC', 'IL', 'BG', 'LC', 'FN - Syndicate loan / club deal'],
    periodTypeList: ['Week', 'Month', 'Year'],
    sublimitFromExistingFacilityList: [],
    currencyList: ['IDR', 'USD'],
    restructList: [
      'Penurunan suku bunga kredit',
      'Perpanjangan jangka waktu kredit',
      'Pengurangan tunggakan pokok kredit',
      'Pengurangan tunggakan bunga kredit',
      'Penambahan fasilitas kredit',
      'Konversi kredit menjadi penyertaan modal sementara',
      'Penambahan fasilitas kredit dan pengurangan tunggakan bunga kredit',
      'Penambahan fasilitas kredit dan perpanjangan jangka waktu kredit',
      'Penambahan fasilitas kredit dan penurunan suku bunga kredit',
      'Penambahan fasilitas kredit, pengurungan tunggakan bunga kredit dan penurunan suku bunga kredit',
      'Penambahan fasilitas kredit, pengurangan tunggakan bunga kredit dan perpanjangan jangka waktu kredit',
      'Lainnya',
    ],
    interestRateTypeList: ['FIXED', 'LIBOR', 'JIBOR', 'TIBOR', 'HIBOR', 'EURIBOR', 'EURO-LIBOR', 'FED FUND', 'OTHER', 'BSBY', 'TERM SOFR'],

    rateAmountTypeList: ['Rate Percentage', 'Amount IDR', 'Amount USD'],
    gracePeriodTypeList: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ],
  };
  public applicationProduct: IApplicationProduct;
  public status = false;
  public unComitted = true;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      applicationProduct: IApplicationProduct;
    },
    private _dialog: MatDialogRef<CreditProposalLoanFacilityDialogComponent>
  ) {
    this.applicationProduct = this.data.applicationProduct;
  }

  public save(): void {
    this._dialog.close(this.applicationProduct);
  }

  public changeIntRateType(event: any): void {
    if (event.value === 'JIBOR' || event.value === 'BSBY' || event.value === 'TERM') {
      this.statIntRate = false;
    } else {
      this.statIntRate = true;
    }
  }

  public berubah(event: any): void {
    if (event.value === 'FN - Syndicate loan / club deal') {
      this.status = true;
    } else {
      this.status = false;
    }
  }

  public calTotalPlafond(): number {
    this.applicationProduct.attributes.totalPlafond =
      Number(this.applicationProduct.attributes.initialLimit) + Number(this.applicationProduct.attributes.changes);
    return Number(this.applicationProduct.attributes.initialLimit) + Number(this.applicationProduct.attributes.changes);
  }
}
