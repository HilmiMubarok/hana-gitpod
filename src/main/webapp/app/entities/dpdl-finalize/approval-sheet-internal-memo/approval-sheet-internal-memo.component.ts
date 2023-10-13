import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalSheetInternalMemoDialogComponent } from './dialog-approval-sheet/approval-sheet-internal-memo-dialog.component';

@Component({
  selector: 'jhi-approval-sheet-internal-memo',
  templateUrl: './approval-sheet-internal-memo.component.html',
  styleUrls: ['./approval-sheet.css'],
})
export class ApprovalSheetInternalMemoComponent {
  constructor(private dialog: MatDialog) {}
  public data = [];
  public displayColumns = ['no', 'noApprovalSheet', 'generateDate', 'action'];

  public openDialog() {
    this.dialog.open(ApprovalSheetInternalMemoDialogComponent, {
      width: '100%', // Defina o tamanho conforme necessário
    });
  }
}
