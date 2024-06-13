import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const formatUTCDateTime = (date: string) => {
  return dayjs(date).utc().format('ddd, MMM D, YYYY HH:mm:ss');
};
export default formatUTCDateTime;
