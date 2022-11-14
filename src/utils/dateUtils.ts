import moment from 'moment';

export const DDMMYYYY = 'DDMMYYYY';
export const DD_MM_YYYY = 'DD-MM-YYYY';
export const YYYY_MM_DD = 'YYYY-MM-DD';
export const READABLE_DDMMYY = 'DD MMM YY';
export const READABLE_DDMMYY_TIME_24H = 'DD MMM YY HH:mm';
export const READABLE_DDMMYY_TIME_12H = 'DD MMM YY, h:mma';
export const READABLE_DDMM = 'DD MMM';

export type MomentRange = [moment.Moment, moment.Moment];

export const getTodayFormattedDate = (format: string) => {
  return moment().format(format);
};
