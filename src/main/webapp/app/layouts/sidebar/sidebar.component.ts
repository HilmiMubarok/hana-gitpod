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
      name: 'Master',
      iconname: 'house',
      children: [
        {
          name: 'Employee',
          iconname: 'minus',
          route: 'employee',
        },
        {
          name: 'Position',
          iconname: 'minus',
          route: 'position',
        },
        {
          name: 'Partner KJPP',
          iconname: 'minus',
          route: 'partner-kjpp',
        },
      ],
    },
    {
      name: 'Initiation',
      iconname: 'pencil-alt',
      children: [
        {
          name: 'Initial Debtor Data',
          iconname: 'minus',
          route: 'party-cif',
        },
        {
          name: 'SLIK Checking',
          iconname: 'minus',
          route: '',
        },
      ],
    },
    {
      name: 'Appraisal',
      iconname: 'file',
      children: [
        {
          name: 'Request Appraisal',
          iconname: 'minus',
          route: 'collateral-appraisal',
        },
        {
          name: 'Appraisal Distribution External',
          iconname: 'minus',
          route: 'batch-apprisal',
          // route: 'collateral-appraisal-distribution-external',
        },
        {
          name: 'Appraisal Distribution Internal',
          iconname: 'minus',
          route: 'collateral-appraisal-distribution-internal',
        },
        {
          name: 'Appraisal Process',
          iconname: 'minus',
          route: 'collateral-appraisal-process',
        },
        {
          name: 'Appraisal Report Approval',
          iconname: 'minus',
          route: 'collateral-appraisal-report-approval',
        },
        {
          name: 'Appraisal Result Inqury',
          iconname: 'minus',
          route: 'collateral-appraisal-result-inqury',
        },
        // {
        //   name: 'Batch Appraisal',
        //   iconname: 'minus',
        //   route: 'batch-apprisal',
        // },
      ],
    },
    {
      name: 'Credit Proposal',
      iconname: 'arrow-trend-up',
      children: [
        {
          name: 'Credit Proposal',
          iconname: 'minus',
          route: 'credit-proposal-status',
        },
        {
          name: 'Credit Proposal Approval',
          iconname: 'minus',
          route: 'cp-status-approval',
        },
      ],
    },
    {
      name: 'Loan Analysis & Approval',
      iconname: 'paperclip',
      children: [
        {
          name: 'Loan Analysis Distribution',
          iconname: 'minus',
          route: 'la-distribution',
        },
        {
          name: 'Loan Analysis',
          iconname: 'minus',
          route: 'la-analyst',
        },
        {
          name: 'Loan Analysis SME Credit Review Checker',
          iconname: 'minus',
          route: 'la-SME-CRC',
        },
        {
          name: 'Loan Approval',
          iconname: 'minus',
          route: 'la-approval',
        },
        {
          name: 'Loan Approval Inquiry',
          iconname: 'minus',
          route: 'la-approval-inquiry',
        },
        {
          name: 'DAR Finalization',
          iconname: 'minus',
          route: 'dar-final',
        },
        {
          name: 'Final DAR - Checker',
          iconname: 'minus',
          route: 'dar-checker',
        },
        {
          name: 'Loan Komite Approval',
          iconname: 'minus',
          route: 'loan-committee-approval',
        },
        {
          name: 'DAR Notification',
          iconname: 'minus',
          route: 'dar-notif',
        },
        {
          name: 'Compliance Checking Distribution',
          iconname: 'minus',
          route: 'cc-distribution',
        },
        {
          name: 'Compliance Checking',
          iconname: 'minus',
          route: 'cc-checking',
        },
        {
          name: 'Compliance Checking Review',
          iconname: 'minus',
          route: 'cc-review',
        },
        {
          name: 'Compliance Checking Inquiry',
          iconname: 'minus',
          route: 'cc-inquiry',
        },
        {
          name: 'Loan Analyst and Approval Monitoring',
          iconname: 'minus',
          route: 'loan-analys-and-approval-monitoring',
        },
      ],
    },
    {
      name: 'Offering Letter & Legal',
      iconname: 'square-check',
      children: [
        {
          name: 'Distribution Offering Letter',
          iconname: 'minus',
          route: 'distribution',
        },
        {
          name: 'Finalize Offering Letter',
          iconname: 'minus',
          route: 'finalize',
        },
        {
          name: 'Offering Letter Review',
          iconname: 'minus',
          route: 'review',
        },
        {
          name: 'Offering Letter Confirmation',
          iconname: 'minus',
          route: 'confirmation',
        },
        // {
        //   name: 'Legal Process',
        //   iconname: 'minus',
        //   route: '',
        // },
      ],
    },
    {
      name: 'Disbursment',
      iconname: 'suitcase',

      children: [
        {
          name: 'Request Disbursment',
          iconname: 'minus',
          route: '',
        },
        {
          name: 'Credit Administration',
          iconname: 'minus',
          route: '',
        },
      ],
    },
    {
      name: 'MIS Report',
      iconname: 'file-lines',
      route: '',
    },
    {
      name: 'Configuration',
      iconname: 'wrench',
      route: 'application-option',
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
