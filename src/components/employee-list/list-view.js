import {LitElement, css, html} from 'lit';
import 'fa-icons';

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
      justify-content: flex-end;
    }

    .action-button {
      padding: 0.5rem;
      border: 1px solid #ff6b00;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
      background-color: white;
      color: #ff6b00;
      height: 2rem;
      width: 2rem;
    }

    .action-button:hover {
      background-color: #f3f4f6;
    }

    .edit-button {
      box-sizing: border-box;
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
                <a
                  class="action-button edit-button"
                  href="/edit/${employee.id}"
                >
                  <fa-icon class="fas fa-edit" size="1em"></fa-icon>
                </a>
                <button
                  class="action-button delete-button"
                  @click=${() => this._handleDelete(employee)}
                >
                  <fa-icon class="fas fa-trash" size="1em"></fa-icon>
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
