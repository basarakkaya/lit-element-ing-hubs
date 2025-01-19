import {LitElement, css, html} from 'lit';

import {MODAL_TYPES} from '../../consts/modalTypes.js';
import i18n from '../../services/i18n';
import store from '../../services/store';

import '../employee-delete';
import '../employee-form';
import '../shared/modal';

export class EmployeeModals extends LitElement {
  static styles = css`
    :host {
      display: block;
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
    this.modals = initialState.modals;

    this.unsubscribe = store.subscribe((state) => {
      const updates = {
        currentEmployee: state.currentEmployee,
        employees: state.employees,
        language: state.language,
        modals: state.modals,
        pagination: state.pagination,
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

  _setViewMode(viewMode) {
    store.setView(viewMode);
  }

  render() {
    return html`
      <lit-modal
        ?isOpen=${this.modals[MODAL_TYPES.DELETE]}
        .title="${i18n.t('employees.modalTitles.delete')}"
        @modal-close="${() => store.closeModal(MODAL_TYPES.DELETE)}"
        ><employee-delete></employee-delete
      ></lit-modal>
    `;
  }
}

window.customElements.define('employee-modals', EmployeeModals);
