import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private drawer: MatDrawer;

  public setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  public toggle() {
    this.drawer.toggle();
  }
}

/* import { Injectable } from '@angular/core';
// import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private sidebarState = 'open';
  private sidebarStateChanged$ = new BehaviorSubject<string>(this.sidebarState);
  public sidebarStateObservable$ = this.sidebarStateChanged$.asObservable();

  constructor() {
    this.sidebarStateChanged$.next('open');
  }

  public toggle() {
    this.sidebarState = this.sidebarState === 'open' ? 'close' : 'open';
    this.sidebarStateChanged$.next(this.sidebarState);
  }
}*/
