import {LitElement, css, html} from 'lit';
import 'fa-icons';

import {MODAL_TYPES} from '../../consts/modalTypes';
import store from '../../services/store';
import i18n from '../../services/i18n';
import {formatDate} from '../../utils/formatters';

export class TableView extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      color: #ff6b00;
      font-weight: 500;
    }

    tr:hover {
      background-color: #f8fafc;
    }

    .actions-cell {
      width: 100px;
      text-align: right;
    }

    .action-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: #ff6b00;
      text-decoration: none;
    }

    .action-button:hover {
      opacity: 0.8;
    }
  `;

  static get properties() {
    return {
      employees: {type: Array},
      language: {type: String},
    };
  }

  constructor() {
    super();

    this.employees = this.employees ?? [];

    this.unsubscribe = store.subscribe((state) => {
      const updates = {
        language: state.language,
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

  _handleDelete(employee) {
    store.openModal(MODAL_TYPES.DELETE, employee);
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
            <th>${i18n.t('employees.form.firstName')}</th>
            <th>${i18n.t('employees.form.lastName')}</th>
            <th>${i18n.t('employees.form.dateOfEmployment')}</th>
            <th>${i18n.t('employees.form.dateOfBirth')}</th>
            <th>${i18n.t('employees.form.phoneNumber')}</th>
            <th>${i18n.t('employees.form.email')}</th>
            <th>${i18n.t('employees.form.department')}</th>
            <th>${i18n.t('employees.form.position')}</th>
            <th class="actions-cell">${i18n.t('employees.list.actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(
            (employee) => html`
              <tr>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${formatDate(employee.dateOfEmployment)}</td>
                <td>${formatDate(employee.dateOfBirth)}</td>
                <td>${employee.phoneNumber}</td>
                <td>${employee.email}</td>
                <td>
                  ${i18n.t(`employees.form.departments.${employee.department}`)}
                </td>
                <td>
                  ${i18n.t(`employees.form.positions.${employee.position}`)}
                </td>
                <td class="actions-cell">
                  <a class="action-button" href="/edit/${employee.id}">
                    <fa-icon class="fas fa-edit" size="1em"></fa-icon>
                  </a>
                  <button
                    class="action-button"
                    @click=${() => this._handleDelete(employee)}
                  >
                    <fa-icon class="fas fa-trash" size="1em"></fa-icon>
                  </button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}

window.customElements.define('table-view', TableView);
