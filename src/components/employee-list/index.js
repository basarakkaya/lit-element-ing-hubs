import {LitElement, css, html} from 'lit';

import {VIEW_MODES} from '../../consts/viewModes';
import store from '../../services/store';

import './empty-state.js';
import './list-header.js';
import './list-view.js';
import './modals.js';
import '../shared/pagination.js';
import './table-view.js';

export class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  static get properties() {
    return {
      language: {type: String},
      employees: {type: Array},
      pagination: {type: Object},
      view: {type: String},
    };
  }

  constructor() {
    super();

    const initialState = store.getState();

    this.employees = initialState.employees;
    this.pagination = initialState.pagination;
    this.view = initialState.view;

    this.unsubscribe = store.subscribe((state) => {
      const updates = {
        employees: state.employees,
        language: state.language,
        pagination: state.pagination,
        view: state.view,
      };

      Object.entries(updates).forEach(([key, value]) => {
        if (this[key] !== value) {
          this[key] = value;
        }
      });
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  _getEmployeesToBeListed() {
    if (!this.employees || !this.pagination) return [];

    const {currentPage, itemsPerPage} = this.pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return this.employees.slice(startIndex, endIndex);
  }

  render() {
    const employeesList = this._getEmployeesToBeListed();

    return html`
      <list-header></list-header>

      ${!this.employees?.length ? html`<empty-state></empty-state>` : null}
      ${!!this.employees?.length && this.view === VIEW_MODES.LIST
        ? html` <list-view .employees=${employeesList}></list-view> `
        : null}
      ${!!this.employees?.length && this.view === VIEW_MODES.TABLE
        ? html` <table-view .employees=${employeesList}></table-view> `
        : null}

      <list-pagination></list-pagination>

      <employee-modals></employee-modals>
    `;
  }
}

window.customElements.define('employee-list', EmployeeList);
