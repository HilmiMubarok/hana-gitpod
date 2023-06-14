import { Pipe, PipeTransform } from '@angular/core';
import { RequestSlikStatus } from '../enums/request-slik-status.enum';

@Pipe({ name: 'reqSlikStatus' })
export class RequestSlikStatusPipe implements PipeTransform {
  reqSlikStatus = RequestSlikStatus;

  transform(status: string): string {
    if (status === this.reqSlikStatus.DRAFT) {
      return 'Draft';
    } else if (status === this.reqSlikStatus.APPROVAL_BU) {
      return 'Approval SLIK By BU';
    } else if (status === this.reqSlikStatus.APPROVAL_SLIK) {
      return 'Approval SLIK By Team SLIK';
    } else if (status === this.reqSlikStatus.CHECKING) {
      return 'Checking In Progress';
    } else if (status === this.reqSlikStatus.RETURN_TO_RM) {
      return 'Return To RM';
    } else if (status === this.reqSlikStatus.VERIFY) {
      return 'Verify';
    } else if (status === this.reqSlikStatus.COMPLETE) {
      return 'Complete';
    } else {
      return 'Cancel';
    }
  }
}
