import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

export function formatBytes(bytes: number, decimals?: number) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function parsePreviousAtrribute(cp: ICreditProposal) {
  const parsedAttribute = {};
  // check if previousReturn attribute is exist
  if (cp.attributes['previousReturn']) {
    // parse previousReturn attributes
    const previousReturn = JSON.parse(cp.attributes['previousReturn']);
    parsedAttribute['previousReturn'] = previousReturn;
    parsedAttribute['previousReturn']['binding'] = JSON.parse(previousReturn['binding']);
    parsedAttribute['previousReturn']['convenant'] = JSON.parse(previousReturn['convenant']);
    parsedAttribute['previousReturn']['insurance'] = JSON.parse(previousReturn['insurance']);
  }

  // check if previousHistory attribute is exist
  if (cp.attributes['previousHistory']) {
    // parse previousHistory attributes
    const previousHistory = JSON.parse(cp.attributes['previousHistory']);
    parsedAttribute['previousHistory'] = previousHistory;
    parsedAttribute['previousHistory']['binding'] = JSON.parse(previousHistory['binding']);
    parsedAttribute['previousHistory']['convenant'] = JSON.parse(previousHistory['convenant']);
    parsedAttribute['previousHistory']['insurance'] = JSON.parse(previousHistory['insurance']);
  }

  return parsedAttribute;
}
