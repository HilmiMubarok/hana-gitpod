import { Pipe, PipeTransform } from '@angular/core';
import { RequestSlikStatus } from '../enums/request-slik-status.enum';

@Pipe({ name: 'reqSlikStatus' })
export class RequestSlikStatusPipe implements PipeTransform {
  reqSlikStatus = RequestSlikStatus;

  transform(status: string): string {
    const statusMap = {
      [this.reqSlikStatus.DRAFT]: 'Draft',
      [this.reqSlikStatus.APPROVAL_BU]: 'Approval SLIK By BU',
      [this.reqSlikStatus.APPROVAL_SLIK]: 'Approval SLIK By Team SLIK',
      [this.reqSlikStatus.CHECKING]: 'Checking In Progress',
      [this.reqSlikStatus.RETURN_TO_RM]: 'Return To RM',
      [this.reqSlikStatus.VERIFY]: 'Verify',
      [this.reqSlikStatus.COMPLETE]: 'Complete',
      [this.reqSlikStatus.CANCEL]: 'Cancel',
    };
    return statusMap[status] || '';
  }
}
