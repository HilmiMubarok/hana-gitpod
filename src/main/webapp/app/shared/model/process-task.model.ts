export interface IProcessTask {
  id?: string;
  definitionKey?: string;
  name?: string;
  formKey?: string;
  taskType?: number;
  caption?: string;
  processId?: number;
  statusCode?: string;
  idStatusItem?: string;
  transitionNumber?: number;
  description?: string;
  requiredConfirmation?: boolean;
  confirmationMessage?: string;
  taskId?: string;
  pid?: string;
  style?: string;
  icon?: string;
  attr?: object;
}

export interface ITaskResult {
  statusResult?: number;
  message?: string;
}

export class ProcessTask implements IProcessTask {
  constructor(
    public id?: string,
    public definitionKey?: string,
    public name?: string,
    public formKey?: string,
    public taskType?: number,
    public icon?: string
  ) {
    this.icon = 'check';
  }
}

export class TaskResult implements ITaskResult {
  constructor(public statusResult?: number, public message?: string) {}
}
