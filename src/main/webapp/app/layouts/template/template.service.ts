import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PositionService } from 'app/entities/position/position.service';

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

  private changgedPosIntObject?: string;
  private triggerChanggedPosIntObject = new BehaviorSubject<string>(this.changgedPosIntObject);
  public triggerChanggedPosIntObjectObservable = this.triggerChanggedPosIntObject.asObservable();

  constructor(private positionService: PositionService) {
    this.sidebarStateChanged$.next('open');
  }

  public toggle() {
    this.sidebarState = this.sidebarState === 'open' ? 'close' : 'open';
    this.sidebarStateChanged$.next(this.sidebarState);
  }

  /* private getLocStor(cookieName: string) {
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
  } */

  private getPos(posId: string): void {
	// this.positionService.find(this.getLocStor('POS')).subscribe(res => {
	this.positionService.find(posId).subscribe(res => {
	  this.changgedPosIntObject = res.body.positionTypeId;
	  this.triggerChanggedPosIntObject.next(this.changgedPosIntObject);
	});
  }

  public changePosInt(newPosTypeId: string) {
    this.changgedPosInt = newPosTypeId;
	this.getPos(newPosTypeId);
    this.triggerChanggedPosInt.next(this.changgedPosInt);
  }
}
