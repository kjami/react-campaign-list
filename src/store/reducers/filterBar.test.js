import reducer from './filterBar';
import * as actionTypes from '../actions/actionTypes';
import { DefaultSortBy, DefaultSortByAsc } from '../../settings';

describe('filter bar reducer tests', () => {
    it('check initial state', () => {
        console.warn = () => { };
        console.error = () => { };
        expect(reducer(undefined, {})).toEqual({
            startDate: null,
            endDate: null,
            searchTerm: null,
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        });
    });

    it('check change start date success', () => {
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: null,
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        }, {
            type: actionTypes.CHANGE_START_DATE,
            payload: {
                startDate: '2/10/2018'
            }
        });
        expect(result.startDate).toBeTruthy();
    });

    it('check change start date failure', () => {
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: null,
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        }, {
            type: actionTypes.CHANGE_START_DATE,
            payload: {
                startDate: '2/aa/2018'
            }
        });
        expect(result.startDate).toBeFalsy();
    });

    it('check change end date success', () => {
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: null,
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        }, {
            type: actionTypes.CHANGE_END_DATE,
            payload: {
                endDate: '2/10/2018'
            }
        });
        expect(result.endDate).toBeTruthy();
    });

    it('check change end date failure', () => {
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: null,
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        }, {
            type: actionTypes.CHANGE_END_DATE,
            payload: {
                endDate: '2/aa/2018'
            }
        });
        expect(result.endDate).toBeFalsy();
    });

    it('check change search term success', () => {
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: null,
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        }, {
            type: actionTypes.CHANGE_SEARCH_TERM,
            payload: {
                searchTerm: 'Campaign'
            }
        });
        expect(result.searchTerm).toBeTruthy();
    });

    it('check change sort by success', () => {
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: null,
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        }, {
            type: actionTypes.CHANGE_SORT_BY,
            payload: {
                sortBy: 'Budget'
            }
        });
        expect(result.sortBy).toEqual('Budget');
    });

    it('check change sort by success', () => {
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: null,
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        }, {
            type: actionTypes.CHANGE_SORT_BY,
            payload: {
                sortBy: DefaultSortBy
            }
        });
        expect(result.sortByAsc).toEqual(!DefaultSortByAsc);
    });

    it('check change sort by success', () => {
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: '123414',
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        }, {
            type: actionTypes.RESET_FILTERS,
            payload: {
                sortBy: DefaultSortBy
            }
        });
        expect(result).toEqual({
            startDate: null,
            endDate: null,
            searchTerm: null,
            sortBy: DefaultSortBy,
            sortByAsc: DefaultSortByAsc
        });
    });
});