import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FacilityDataType {
  newFacility: number;
  existingFacility: number;
  additionalTopupFacility: number;
  renewalFacility: number;
  restructureFacility: number;
  decreaseFacility: number;
  othersFacility: number;
  additionalOthersFacility: number;
  renewalAdditionalFacility: number;
  renewalDecreaseFacility: number;
  renewalOthersFacility: number;
  decreaseOthersFacility: number;
}

export interface ProductivityRow {
  applicationType: string;
  aveTrxMonth: number;
  aveInDay: number;
  slaStandard: number;
  staffNeeds: number;
  totalStaffNeeds: number;
  existing: number;
  shortOver: number;
}

@Injectable({
  providedIn: 'root',
})
export class MisCpSlaloanopsProductivityService {
  private month1$ = new BehaviorSubject<number>(0);
  private month2$ = new BehaviorSubject<number>(0);
  private month3$ = new BehaviorSubject<number>(0);
  private slaStandard$ = new BehaviorSubject<number>(0);
  private existing$ = new BehaviorSubject<number>(0);
  private staffNeedsArr$ = new BehaviorSubject<number[]>([]);
  private processedRows$ = new BehaviorSubject<ProductivityRow[]>([]);
  public processedRowsObservable$ = this.processedRows$.asObservable();
  private applicationTypeToField: Record<string, keyof FacilityDataType> = {
    New: 'newFacility',
    Existing: 'existingFacility',
    'Additional / Top Up': 'additionalTopupFacility',
    Renewal: 'renewalFacility',
    Restructure: 'restructureFacility',
    Decrease: 'decreaseFacility',
    Others: 'othersFacility',
    'Additional + Others': 'additionalOthersFacility',
    'Renewal + Additional': 'renewalAdditionalFacility',
    'Renewal + Decrease': 'renewalDecreaseFacility',
    'Renewal + Others': 'renewalOthersFacility',
    'Decrease + Others': 'decreaseOthersFacility',
  };

  processFacilityData(data: FacilityDataType[], slaStandard = 0, existing = 0) {
    const applicationTypes = Object.keys(this.applicationTypeToField);
    const rows: ProductivityRow[] = applicationTypes.map(appType => {
      const field = this.applicationTypeToField[appType];
      const sum = data.reduce((acc, curr) => acc + (curr[field] || 0), 0);
      const aveTrxMonth = data.length > 0 ? sum / data.length : 0;
      const aveInDay = Math.ceil(this.roundToDecimals(aveTrxMonth / 22, 1));
      const staffNeeds = Math.ceil(this.roundToDecimals((slaStandard * aveInDay) / 420, 1));
      return {
        applicationType: appType,
        aveTrxMonth,
        aveInDay,
        slaStandard,
        staffNeeds,
        totalStaffNeeds: 0,
        existing,
        shortOver: 0,
      };
    });
    const totalStaffNeeds = rows.reduce((acc, row) => acc + row.staffNeeds, 0);
    rows.forEach(row => {
      row.totalStaffNeeds = totalStaffNeeds;
      const shortOver = row.totalStaffNeeds - row.existing;
      row.shortOver = shortOver;
    });
    this.processedRows$.next(rows);
  }

  roundToDecimals(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.ceil(value * factor) / factor;
  }

  setMonth1(value: number) {
    this.month1$.next(value);
  }
  setMonth2(value: number) {
    this.month2$.next(value);
  }
  setMonth3(value: number) {
    this.month3$.next(value);
  }
  setSlaStandard(value: number) {
    this.slaStandard$.next(value);
  }
  setExisting(value: number) {
    this.existing$.next(value);
  }
  setStaffNeedsArr(arr: number[]) {
    this.staffNeedsArr$.next(arr);
  }

  readonly avgTrxMonth$: Observable<number> = combineLatest([this.month1$, this.month2$, this.month3$]).pipe(
    map(([m1, m2, m3]) => (m1 + m2 + m3) / 3)
  );

  readonly avgInDay$: Observable<number> = this.avgTrxMonth$.pipe(map(avgTrxMonth => avgTrxMonth / 22));

  readonly staffNeeds$: Observable<number> = combineLatest([this.slaStandard$, this.avgInDay$]).pipe(
    map(([slaStandard, avgInDay]) => (slaStandard * avgInDay) / 420)
  );

  readonly totalStaffNeeds$: Observable<number> = this.staffNeedsArr$.pipe(map(arr => arr.reduce((a, b) => a + b, 0)));

  readonly shortOver$: Observable<number> = combineLatest([this.staffNeeds$, this.existing$]).pipe(
    map(([staffNeeds, existing]) => staffNeeds - existing)
  );
}
