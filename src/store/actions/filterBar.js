import { CHANGE_START_DATE, CHANGE_END_DATE, CHANGE_SEARCH_TERM, CHANGE_SORT_BY, RESET_FILTERS } from '../actions/actionTypes';

export const changeStartDate = (payload) => ({
    type: CHANGE_START_DATE,
    payload: payload
});

export const changeEndDate = (payload) => ({
    type: CHANGE_END_DATE,
    payload: payload
});

export const changeSearchTerm = (payload) => ({
    type: CHANGE_SEARCH_TERM,
    payload: payload
});

export const changeSortBy = (payload) => ({
    type: CHANGE_SORT_BY,
    payload: payload
});

export const resetFilters = (payload) => ({
    type: RESET_FILTERS,
    payload: payload
});