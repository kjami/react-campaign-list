import moment from 'moment';
import { CHANGE_START_DATE, CHANGE_END_DATE, CHANGE_SEARCH_TERM, CHANGE_SORT_BY, RESET_FILTERS } from '../actions/actionTypes';
import logger from '../../utils/logger';
import { InputDateFormat, DefaultSortBy, DefaultSortByAsc } from '../../settings';

const initialState = {
    startDate: null,
    endDate: null,
    searchTerm: null,
    sortBy: DefaultSortBy,
    sortByAsc: DefaultSortByAsc
}

const changeDate = (state, date, property) => {
    const newDate = moment(date);
    if (newDate.isValid()) {
        const updatedState = {
            ...state
        };
        updatedState[property] = newDate.format(InputDateFormat);

        if (property === 'endDate' && updatedState.startDate && moment(updatedState.startDate, InputDateFormat) > moment(updatedState.endDate, InputDateFormat)) {
            updatedState.endDate = null;
        }

        return updatedState
    } else {
        logger.error(`${property} value is invalid.`);
    }
    return state;
}

const changeStartDate = (state, { payload: { startDate } = {} } = {}) => {
    return changeDate(state, startDate, 'startDate');
}

const changeEndDate = (state, { payload: { endDate } = {} } = {}) => {
    return changeDate(state, endDate, 'endDate');
}

const changeSearchTerm = (state, { payload: { searchTerm } = {} } = {}) => {
    return {
        ...state,
        searchTerm: searchTerm || null
    };
}

const changeSortBy = (state, { payload: { sortBy } = {} } = {}) => {
    let sortByAsc = state.sortByAsc;
    sortByAsc = (state.sortBy === sortBy) ? !sortByAsc : DefaultSortByAsc;

    return {
        ...state,
        sortByAsc: sortByAsc,
        sortBy
    };
}

const resetFilters = () => {
    return {
        ...initialState
    };
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_START_DATE:
            return changeStartDate(state, action);
        case CHANGE_END_DATE:
            return changeEndDate(state, action);
        case CHANGE_SEARCH_TERM:
            return changeSearchTerm(state, action);
        case CHANGE_SORT_BY:
            return changeSortBy(state, action);
        case RESET_FILTERS:
            return resetFilters();
        default:
            return state;
    }
}

export default reducer;