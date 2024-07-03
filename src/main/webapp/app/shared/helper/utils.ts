import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import moment from 'moment';
import lodash, { get } from 'lodash';

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

export interface IParsePreviousAtrribute {
  previousReturn?: any;
  previousHistory?: any;
  darRevHistory?: any;
  previousOfferingLetter?: any;
}

export function parsePreviousAtrribute(cp: ICreditProposal): IParsePreviousAtrribute {
  const parsedAttribute = {};

  const attributes = ['previousReturn', 'previousHistory', 'darRevHistory', 'previousOfferingLetter'];
  const subAttributes = [
    'binding',
    'convenant',
    'insurance',
    'facilityDetail',
    'creditProposalCollateralData',
    'facilityTakeOver',
    'facilityTakeOverAfterBank',
    'groupChecklisCollateral',
    'collateralPrevious',
    'creditProposalCollateralData',
    'coverageTotal',
    'collateralSummary',
  ];

  for (const attribute of attributes) {
    if (cp.attributes[attribute]) {
      const parsedAttributeObj =
        typeof cp.attributes[attribute] === 'string' ? JSON.parse(cp.attributes[attribute]) : cp.attributes[attribute];
      parsedAttribute[attribute] = parsedAttributeObj;

      for (const subAttribute of subAttributes) {
        if (parsedAttributeObj[subAttribute]) {
          parsedAttributeObj[subAttribute] =
            typeof parsedAttributeObj[subAttribute] === 'string'
              ? JSON.parse(parsedAttributeObj[subAttribute])
              : parsedAttributeObj[subAttribute];
        }
      }
    }
  }

  return parsedAttribute;
}

export function formatDateDob(dateString) {
  return getStaticDate(dateString);
}

function getStaticDate(date) {
  const a = moment(new Date(date))
    .utcOffset(moment(new Date(Date.now())).utcOffset())
    .format()
    .split('T')[0];

  const dateString = date.toString();
  const monthObject = convertStringMonthToNumber(dateString.substring(4, 7));
  const day = dateString.substring(8, 10);
  const year = dateString.substring(11, 15);

  if (dateString === 'Invalid Date') {
    return '-';
  }

  console.table({ a, dateString, monthObject, day, year });

  return `${monthObject.desc}, ${day} ${year}`;
}

function convertStringMonthToNumber(monthString) {
  const monthArray = [
    {
      desc: 'Jan',
      numString: '1',
    },
    {
      desc: 'Feb',
      numString: '2',
    },
    {
      desc: 'Mar',
      numString: '3',
    },
    {
      desc: 'Apr',
      numString: '4',
    },
    {
      desc: 'May',
      numString: '5',
    },
    {
      desc: 'Jun',
      numString: '6',
    },
    {
      desc: 'Jul',
      numString: '7',
    },
    {
      desc: 'Aug',
      numString: '8',
    },
    {
      desc: 'Sep',
      numString: '9',
    },
    {
      desc: 'Oct',
      numString: '10',
    },
    {
      desc: 'Nov',
      numString: '11',
    },
    {
      desc: 'Dec',
      numString: '12',
    },
  ];

  return lodash.find(monthArray, function (month) {
    return month.desc === monthString;
  });
}
