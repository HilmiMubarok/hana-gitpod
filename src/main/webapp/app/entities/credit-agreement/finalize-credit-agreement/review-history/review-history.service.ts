import { Injectable } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { IReviewHistory, ReviewHistory } from './review-history';

@Injectable({
  providedIn: 'root',
})
export class ReviewHistoryService {
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // applicationId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  // approverName$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  // position$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  // date$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  // applicationId: Observable<number> = this.applicationId$.asObservable();
  // approverName: Observable<string> = this.approverName$.asObservable();
  // position: Observable<string> = this.position$.asObservable();
  // date: Observable<string> = this.date$.asObservable();

  //   creditProposal$: BehaviorSubject<ICreditProposal> = new BehaviorSubject<ICreditProposal>(null);
  //   creditProposal: Observable<ICreditProposal> = this.creditProposal$.asObservable();

  //   notes$: BehaviorSubject<INotes[]> = new BehaviorSubject<INotes[]>(null);
  //   notes: Observable<INotes[]> = this.notes$.asObservable();

  //   setCreditProposal(cp: ICreditProposal) {
  //     this.creditProposal$.next(cp);
  //     this.notes$.next(cp.notes);
  //   }

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
