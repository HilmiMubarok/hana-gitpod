interface IProspectPerson {
  accountStatus?: string;
  umkm?: string;
}

export class ProspectPerson implements IProspectPerson {
  constructor(public accountStatus?: string, public umkm?: string) {
    this.accountStatus = '';
    this.umkm = '';
  }
}
