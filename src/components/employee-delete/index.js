import {LitElement, css, html} from 'lit';

import {MODAL_TYPES} from '../../consts/modalTypes';
import i18n from '../../services/i18n';
import store from '../../services/store';

import '../shared/modal';

export class EmployeeDeleteModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }

    button[type='submit'] {
      background-color: #ff6b00;
      color: white;
    }

    button[type='submit']:hover {
      background-color: #e65a00;
    }

    button[type='button'] {
      background-color: white;
      border: 1px solid #ff6b00;
      color: #ff6b00;
    }

    button[type='button']:hover {
      background-color: #f3f4f6;
    }
  `;

  static get properties() {
    return {
      currentEmployee: {type: Object},
      modals: {type: Object},
    };
  }

  constructor() {
    super();

    const initialState = store.getState();

    this.currentEmployee = initialState.currentEmployee;

    this.unsubscribe = store.subscribe((state) => {
      const updates = {
        currentEmployee: state.currentEmployee,
        language: state.language,
        modals: state.modals,
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

  _handleDelete() {
    store.deleteEmployee(this.currentEmployee.id);
    store.closeModal(MODAL_TYPES.DELETE);
  }

  _handleCancel() {
    store.closeModal(MODAL_TYPES.DELETE);
  }

  render() {
    const {firstName = '', lastName = ''} = this.currentEmployee ?? {};
    const fullName = [firstName, lastName].join(' ');
    return html`
      <p>${i18n.tFormat('employees.confirmations.delete', {fullName})}</p>
      <div class="actions">
        <button type="button" @click=${this._handleCancel}>
          ${i18n.t('employees.form.cancel')}
        </button>
        <button type="submit" @click=${this._handleDelete}>
          ${i18n.t('employees.form.proceed')}
        </button>
      </div>
    `;
  }
}

window.customElements.define('employee-delete', EmployeeDeleteModal);
