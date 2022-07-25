import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AccountService } from 'app/core/auth/account.service';
import { TemplateService } from './template.service';

@Component({
  selector: 'jhi-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TemplateComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebardrawer')
  public drawer: MatDrawer;
  public sideBarVisible: Boolean = false;

  constructor(private accountService: AccountService, private templateService: TemplateService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.sideBarVisible = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.templateService.setDrawer(this.drawer);
  }
}
