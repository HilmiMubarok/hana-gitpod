export interface IProcessTask {
  id?: string;
  definitionKey?: string;
  name?: string;
  formKey?: string;
  taskType?: number;
  caption?: string;
  statusCode?: string;
  transitionNumber?: number;
  description?: string;
  requiredConfirmation?: boolean;
  confirmationMessage?: string;
  taskId?: string;
  pid?: string;
  style?: string;
  icon?: string;
  statusTypeId?: string;
  statusItemId?: string;
  assignee?: string;
  attr?: object;
  note?: string;
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
    public icon?: string,
    public caption?: string,
    public statusCode?: string,
    public transitionNumber?: number,
    public description?: string,
    public requiredConfirmation?: boolean,
    public confirmationMessage?: string,
    public taskId?: string,
    public pid?: string,
    public style?: string,
    public statusTypeId?: string,
    public statusItemId?: string,
    public assignee?: string,
    public attr?: object,
    public note?: string
  ) {
    this.icon = 'check';
  }
}

export class TaskResult implements ITaskResult {
  constructor(public statusResult?: number, public message?: string) {}
}
