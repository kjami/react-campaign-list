import moment from 'moment';
import { InputDateFormat } from '../settings';

const campaignSchema = [
    { name: 'name', type: 'string' },
    { name: 'startDate', type: 'date' },
    {
        name: 'endDate',
        type: 'date',
        validation: ({ startDate = 'a', endDate = 'a' }) => {
            const s = moment(startDate, InputDateFormat);
            const e = moment(endDate, InputDateFormat);
            if (!s.isValid() || !e.isValid() || s > e) {
                return 'endDate > startDate';
            }
            return '';
        }
    },
    { name: 'Budget', type: 'number' }
];

export default campaignSchema;