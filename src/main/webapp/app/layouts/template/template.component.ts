import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AccountService } from 'app/core/auth/account.service';
import { TemplateService } from './template.service';
import { mainContentAnimation } from '../../animations';

@Component({
  selector: 'jhi-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [mainContentAnimation()],
})
export class TemplateComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebardrawer')
  public drawer: MatDrawer;
  sidebarState: string;

  constructor(private accountService: AccountService, private templateService: TemplateService) {}

  public isLogIn = false;
  private cook = '';

  private getLocStor(cookieName: string) {
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

  ngOnInit(): void {
    this.cook = this.getLocStor('POS');
    this.isLogIn = this.cook === '' ? false : true;

    if (this.isLogIn) {
      this.accountService.identity().subscribe(account => {
        if (account) {
          this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
            this.sidebarState = newState;
          });
        }
      });
    }
    /* this.accountService.identity().subscribe(account => {
      if (account) {
        this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
          this.sidebarState = newState;
        });
      }
    }); */
  }

  ngAfterViewInit(): void {
    this.templateService.toggle();
  }
}
