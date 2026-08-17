import { format } from 'date-fns';

export const safeFormatDate = (dateVal: any, pattern: string = 'MMM dd, yyyy'): string => {
  if (!dateVal) return 'Recently';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return 'Recently';
  try {
    return format(d, pattern);
  } catch {
    return 'Recently';
  }
};
