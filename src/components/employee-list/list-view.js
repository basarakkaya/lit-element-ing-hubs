import {LitElement, css, html} from 'lit';

import {MODAL_TYPES} from '../../consts/modalTypes';
import store from '../../services/store';
import i18n from '../../services/i18n';
import {formatDate} from '../../utils/formatters';

export class ListView extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .employees-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .employee-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .employee-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: #333;
    }

    .employee-info {
      display: grid;
      gap: 0.5rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.875rem;
    }

    .info-label {
      color: #999;
      min-width: 100px;
    }

    .department-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #f0f0f0;
      border-radius: 1rem;
      font-size: 0.75rem;
      margin-top: 0.5rem;
      width: fit-content;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .action-button {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .edit-button {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .edit-button:hover {
      background-color: #bbdefb;
    }

    .delete-button {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .delete-button:hover {
      background-color: #ffcdd2;
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

  _handleEdit(employee) {
    store.openModal(MODAL_TYPES.ADD_EDIT, employee);
  }

  _handleDelete(employee) {
    store.openModal(MODAL_TYPES.DELETE, employee);
  }

  render() {
    return html`
      <div class="employees-list">
        ${this.employees.map(
          (employee) => html`
            <div class="employee-card">
              <h3 class="employee-name">
                ${employee.firstName} ${employee.lastName}
              </h3>
              <div class="employee-info">
                <div class="info-item">
                  <span class="info-label"
                    >${i18n.t('employees.form.dateOfEmployment')}:</span
                  >
                  <span>${formatDate(employee.dateOfEmployment)}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"
                    >${i18n.t('employees.form.dateOfBirth')}</span
                  >
                  <span>${formatDate(employee.dateOfBirth)}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"
                    >${i18n.t('employees.form.phoneNumber')}:</span
                  >
                  <span>${employee.phoneNumber}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"
                    >${i18n.t('employees.form.email')}:</span
                  >
                  <span>${employee.email}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"
                    >${i18n.t('employees.form.position')}:</span
                  >
                  <span
                    >${i18n.t(
                      `employees.form.positions.${employee.position}`
                    )}</span
                  >
                </div>
                <div class="department-badge">
                  ${i18n.t(`employees.form.departments.${employee.department}`)}
                </div>
              </div>
              <div class="card-actions">
                <button
                  class="action-button edit-button"
                  @click=${() => this._handleEdit(employee)}
                >
                  Edit
                </button>
                <button
                  class="action-button delete-button"
                  @click=${() => this._handleDelete(employee)}
                >
                  Delete
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}

window.customElements.define('list-view', ListView);
