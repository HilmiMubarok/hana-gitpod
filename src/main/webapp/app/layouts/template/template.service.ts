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
