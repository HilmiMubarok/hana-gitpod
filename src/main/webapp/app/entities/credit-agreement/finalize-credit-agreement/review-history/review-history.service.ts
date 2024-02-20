import { Injectable } from '@angular/core';
import { INotes } from 'app/entities/notes/notes.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { IReviewHistory } from './review-history';

@Injectable({
  providedIn: 'root',
})
export class ReviewHistoryService {
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  saveReviewHistory$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  saveReviewHistory: Observable<boolean> = this.saveReviewHistory$.asObservable();

  reviewHistory$: BehaviorSubject<IReviewHistory[]> = new BehaviorSubject<IReviewHistory[]>([]);
  reviewHistory: Observable<IReviewHistory[]> = this.reviewHistory$.asObservable();

  notes$: BehaviorSubject<INotes[]> = new BehaviorSubject<INotes[]>([]);
  notes: Observable<INotes[]> = this.notes$.asObservable();

  currentNote$: BehaviorSubject<INotes> = new BehaviorSubject<INotes>(null);
  currentNote: Observable<INotes> = this.currentNote$.asObservable();

  visibleRemarks$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  visibleRemarks = this.visibleRemarks$.asObservable();

  setReviewHistoryData(notes: INotes[], positionId: number): void {
    this.notes$.next(notes);
    const reviewHistory = notes.filter(note => note.type === 'review_history' && note.positionId === positionId);

    // sort by id desc
    reviewHistory.sort((a, b) => b.id - a.id);

    const currentNote = reviewHistory.find(note => note.statusId === 'DRAFT');

    // if currentNote is'nt found, get the last one
    if (!currentNote) {
      this.currentNote$.next(reviewHistory[0]);
    } else {
      this.currentNote$.next(currentNote);
    }

    const reviewHistoryData: IReviewHistory[] = notes
      .filter(data => data.statusId !== 'DRAFT' && data.type === 'review_history')
      // sort asc by id
      .sort((a, b) => a.id - b.id)
      .map(note => ({
        approverName: `${note.employeeFirstName} ${note.employeeLastName}`,
        position: note.positionTypeDescription,
        date: note.createDate,
        path: note.path,
      }));

    this.reviewHistory$.next(reviewHistoryData);
  }

  triggerSaveReviewHistory(): void {
    this.saveReviewHistory$.next(true);
  }

  public getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }
}
