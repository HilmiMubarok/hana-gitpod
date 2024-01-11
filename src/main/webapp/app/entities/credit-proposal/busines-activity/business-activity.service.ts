import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusinessActivityService {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public progress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public progressDocx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public progressSfdt$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public isUpload$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public setLoading(value: boolean): void {
    this.isLoading$.next(value);
  }

  public setProgresss(value: number): void {
    this.progress$.next(value);
  }
  public setProgress(value: number, where?: string): void {
    if (where === 'Docx') {
      this.progressDocx$.next(value);
    } else {
      this.progressSfdt$.next(value);
    }
  }
}
