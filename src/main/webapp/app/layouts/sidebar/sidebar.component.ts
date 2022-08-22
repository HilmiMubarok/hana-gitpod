import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { TemplateService } from '../template/template.service';
import { FlatNode, ISidebarMenuModel, SidebarMenuModel } from './sidebar.model';
import { sidebarAnimation, iconAnimation, labelAnimation } from '../../animations';

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [sidebarAnimation(), iconAnimation(), labelAnimation()],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('tree') public tree;
  public account: Account | null = null;
  public sidebarState: string;
  private treeData: ISidebarMenuModel[] = [
    {
      name: '1. Master',
      iconname: 'house',
      children: [
        {
          name: '1.1 Employee',
          iconname: 'minus',
          route: 'employee',
        },
        {
          name: '1.2 Position',
          iconname: 'minus',
          route: 'position',
        },
      ],
    },
    {
      name: '2. Initiation',
      iconname: 'pencil-alt',
      children: [
        {
          name: '2.1 Initial Debtor Data',
          iconname: 'minus',
          route: 'credit-proposal',
        },
        {
          name: '2.2 Credit Proposal',
          iconname: 'minus',
          route: '',
        },
        {
          name: '2.3 SLIK Checking',
          iconname: 'minus',
          route: '',
        },
      ],
    },
    {
      name: '3. Appraisal',
      iconname: 'file',
      children: [
        {
          name: '3.1 Request Appraisal',
          iconname: 'minus',
          route: 'collateral-appraisal',
        },
        {
          name: '3.2 Appraisal Distribution',
          iconname: 'minus',
          route: 'collateral-appraisal-distribution',
        },
        {
          name: '3.3 Appraisal Process/Report',
          iconname: 'minus',
          route: 'collateral-appraisal-process-report',
        },
        {
          name: '3.4 Appraisal Process Approval',
          iconname: 'minus',
          route: 'collateral-appraisal-process-approval',
        },
        {
          name: '3.5 Appraisal Report Upload (Independent)',
          iconname: 'minus',
          route: 'collateral-appraisal-report-upload',
        },

        {
          name: '3.6 Appraisal Result',
          iconname: 'minus',
          route: '',
        },
      ],
    },
    {
      name: '4. Credit Proposal',
      iconname: 'arrow-trend-up',
      children: [
        {
          name: '4.1 Credit Proposal',
          iconname: 'minus',
          route: '',
        },
        {
          name: '4.2 Credit Proposal Approval',
          iconname: 'minus',
          route: '',
        },
      ],
    },
    {
      name: '5. Loan Analysis & Approval',
      iconname: 'paperclip',
      children: [
        {
          name: '5.1 Loan Proposal Distribution',
          iconname: 'minus',
          route: '',
        },
        {
          name: '5.2 Loan Analysis',
          iconname: 'minus',
          route: '',
        },
        {
          name: '5.3 Loan Approval',
          iconname: 'minus',
          route: '',
        },
      ],
    },
    {
      name: '6. Offering Letter & Legal',
      iconname: 'square-check',
      children: [
        {
          name: '6.1 Finalize & Review Offering Letter',
          iconname: 'minus',
          route: '',
        },
        {
          name: '6.2 Confirm Offering Letter',
          iconname: 'minus',
          route: '',
        },
        {
          name: '6.3 Legal Process',
          iconname: 'minus',
          route: '',
        },
      ],
    },
    {
      name: '7. Disbursment',
      iconname: 'suitcase',

      children: [
        {
          name: '7.1 Request Disbursment',
          iconname: 'minus',
          route: '',
        },
        {
          name: '7.2 Credit Administration',
          iconname: 'minus',
          route: '',
        },
      ],
    },
    {
      name: '8. MIS Report',
      iconname: 'file-lines',
      route: '',
    },
  ];

  public treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  public treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  public dataSource: any = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private accountService: AccountService, private router: Router, private templateService: TemplateService) {
    this.dataSource.data = this.treeData;
    this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
      if (newState === 'close') {
        this.tree.treeControl.collapseAll();
      }
    });
  }

  ngOnInit(): void {
    this.checkLogin();
    this.templateService.sidebarStateObservable$.subscribe((newState: string) => {
      this.sidebarState = newState;
    });
  }

  ngAfterViewInit(): void {
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  private checkLogin(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public selectedNode(): void {
    this.templateService.toggle();
  }

  public selectedIcon(): void {
    this.templateService.toggle();
  }

  public getClassActive(route: string): string {
    const currentUrl = this.router.url;
    if (currentUrl === '/' + route) {
      return 'selected';
    }
    return null;
  }

  private transformer(node: SidebarMenuModel, lvl: number): any {
    const exp = !!node.children && node.children.length > 0;
    return {
      expandable: exp,
      name: node.name,
      iconname: node.iconname,
      level: lvl,
      route: node.route,
    };
  }

  public hasChild(_: number, node: FlatNode): any {
    return node.expandable;
  }
}
