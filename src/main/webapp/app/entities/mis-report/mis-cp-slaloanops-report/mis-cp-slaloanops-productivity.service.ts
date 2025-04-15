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
  // State subjects
  private month1$ = new BehaviorSubject<number>(0);
  private month2$ = new BehaviorSubject<number>(0);
  private month3$ = new BehaviorSubject<number>(0);
  private slaStandard$ = new BehaviorSubject<number>(0);
  private existing$ = new BehaviorSubject<number>(0);
  private staffNeedsArr$ = new BehaviorSubject<number[]>([]);

  // Processed data subject
  private processedRows$ = new BehaviorSubject<ProductivityRow[]>([]);
  public processedRowsObservable$ = this.processedRows$.asObservable();

  // Mapping for application types to facility fields
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

  // Main method to process facility data
  processFacilityData(data: FacilityDataType[], slaStandard = 0, existing = 0) {
    // Calculate average for each application type across the array
    const applicationTypes = Object.keys(this.applicationTypeToField);
    const rows: ProductivityRow[] = applicationTypes.map(appType => {
      const field = this.applicationTypeToField[appType];
      // Calculate average for this field across all data
      const sum = data.reduce((acc, curr) => acc + (curr[field] || 0), 0);
      const aveTrxMonth = data.length > 0 ? sum / data.length : 0;
      const aveInDay = aveTrxMonth / 22;
      const staffNeeds = (slaStandard * aveInDay) / 420;
      return {
        applicationType: appType,
        aveTrxMonth,
        aveInDay,
        slaStandard,
        staffNeeds,
        totalStaffNeeds: 0, // will be filled after
        existing,
        shortOver: 0, // will be filled after
      };
    });
    // Calculate totalStaffNeeds and shortOver
    const totalStaffNeeds = rows.reduce((acc, row) => acc + row.staffNeeds, 0);
    rows.forEach(row => {
      row.totalStaffNeeds = totalStaffNeeds;
      row.shortOver = row.staffNeeds - row.existing;
    });
    this.processedRows$.next(rows);
  }

  // Setters
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

  // Calculated Observables
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

  // Optionally, expose the BehaviorSubjects as Observables for external subscription
  getMonth1$(): Observable<number> {
    return this.month1$.asObservable();
  }
  getMonth2$(): Observable<number> {
    return this.month2$.asObservable();
  }
  getMonth3$(): Observable<number> {
    return this.month3$.asObservable();
  }
  getSlaStandard$(): Observable<number> {
    return this.slaStandard$.asObservable();
  }
  getExisting$(): Observable<number> {
    return this.existing$.asObservable();
  }
  getStaffNeedsArr$(): Observable<number[]> {
    return this.staffNeedsArr$.asObservable();
  }
}
