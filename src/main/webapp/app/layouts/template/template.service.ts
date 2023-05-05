import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private sidebarState?: string;
  private sidebarStateChanged$ = new BehaviorSubject<string>(this.sidebarState);
  public sidebarStateObservable$ = this.sidebarStateChanged$.asObservable();

  private changgedPosInt?: string;
  private triggerChanggedPosInt = new BehaviorSubject<string>(this.changgedPosInt);
  public triggerChanggedPosIntObservable = this.triggerChanggedPosInt.asObservable();

  constructor() {
    this.sidebarStateChanged$.next('open');
  }

  public toggle() {
    this.sidebarState = this.sidebarState === 'open' ? 'close' : 'open';
    this.sidebarStateChanged$.next(this.sidebarState);
  }

  public changePosInt(newPosTypeId: string) {
    this.changgedPosInt = newPosTypeId;
    this.triggerChanggedPosInt.next(this.changgedPosInt);
  }
}
