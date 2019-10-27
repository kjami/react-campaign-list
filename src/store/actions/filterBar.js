import { CHANGE_START_DATE, CHANGE_END_DATE, CHANGE_SEARCH_TERM, CHANGE_SORT_BY, RESET_FILTERS } from '../actions/actionTypes';

//Action to change start date filter
//Payload accepts startDate string (as output format in settings file)
export const changeStartDate = (payload) => ({
    type: CHANGE_START_DATE,
    payload: payload
});

//Action to change end date filter
//Payload accepts endDate string (as output format in settings file)
export const changeEndDate = (payload) => ({
    type: CHANGE_END_DATE,
    payload: payload
});

//Action to change search term filter
//Payload accepts searchTerm string (as output format in settings file)
export const changeSearchTerm = (payload) => ({
    type: CHANGE_SEARCH_TERM,
    payload: payload
});

//Action to change sorting
//Payload accepts sortBy string (sortBy should have one of the values in campaigns schema)
export const changeSortBy = (payload) => ({
    type: CHANGE_SORT_BY,
    payload: payload
});

//Action to reset all filters
export const resetFilters = () => ({
    type: RESET_FILTERS
});