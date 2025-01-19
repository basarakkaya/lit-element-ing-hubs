import {LitElement, css, html} from 'lit';

import i18n from '../../services/i18n';
import store from '../../services/store';

import '../shared/modal';

export class EmployeeEditConfirmationModal extends LitElement {
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
      onCancel: {},
      onProceed: {},
    };
  }

  constructor() {
    super();

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

  _handleSubmit() {
    this.onProceed();
  }

  _handleCancel() {
    this.onCancel();
  }

  render() {
    return html`
      <p>${i18n.tFormat('employees.confirmations.edit')}</p>
      <div class="actions">
        <button type="button" @click=${this._handleCancel}>
          ${i18n.t('employees.form.cancel')}
        </button>
        <button type="submit" @click=${this._handleSubmit}>
          ${i18n.t('employees.form.proceed')}
        </button>
      </div>
    `;
  }
}

window.customElements.define(
  'edit-confirmation',
  EmployeeEditConfirmationModal
);
