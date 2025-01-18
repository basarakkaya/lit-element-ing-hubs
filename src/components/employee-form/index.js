import {LitElement, css, html} from 'lit';

import {DEPARTMENTS} from '../../consts/departments';
import {MODAL_TYPES} from '../../consts/modalTypes';
import {POSITIONS} from '../../consts/positions';
import i18n from '../../services/i18n';
import store from '../../services/store';
import {validateEmployeeForm} from '../../utils/validators';

import '../shared/form-group';
import '../shared/modal';
import '../shared/select-input';
import '../shared/text-input';

export class EmployeeFormModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
      errors: {type: Object},
      formData: {type: Object},
    };
  }

  setFormData(currentEmployee) {
    this.formData = {
      firstName: currentEmployee?.firstName || '',
      lastName: currentEmployee?.lastName || '',
      dateOfEmployment: currentEmployee?.dateOfEmployment
        ? currentEmployee.dateOfEmployment.split('T')[0]
        : '',
      dateOfBirth: currentEmployee?.dateOfBirth
        ? currentEmployee?.dateOfBirth.split('T')[0]
        : '',
      phoneNumber: currentEmployee?.phoneNumber || '',
      email: currentEmployee?.email || '',
      department: currentEmployee?.department || '',
      position: currentEmployee?.position || '',
    };
  }

  constructor() {
    super();

    this.errors = {};

    this.unsubscribe = store.subscribe((state) => {
      const updates = {
        currentEmployee: state.currentEmployee,
        language: state.language,
      };

      Object.entries(updates).forEach(([key, value]) => {
        if (this[key] !== value) {
          this[key] = value;
        }
      });
    });

    this.setFormData(this.currentEmployee);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('currentEmployee')) {
      this.setFormData(this.currentEmployee);
    }
  }

  _closeModal() {
    store.closeModal(MODAL_TYPES.ADD_EDIT);
    this.setFormData();
  }

  _handleInputChange(e) {
    const {field, value} = e.detail;

    this.formData = {
      ...this.formData,
      [field]: value,
    };
  }

  _handleSubmit(e) {
    e.preventDefault();

    const employee = {
      firstName: this.formData.firstName?.trim(),
      lastName: this.formData.lastName?.trim(),
      dateOfEmployment: this.formData.dateOfEmployment
        ? new Date(this.formData.dateOfEmployment).toISOString()
        : null,
      dateOfBirth: this.formData.dateOfBirth
        ? new Date(this.formData.dateOfBirth).toISOString()
        : null,
      phoneNumber: this.formData.phoneNumber?.trim(),
      email: this.formData.email?.trim(),
      department: this.formData.department,
      position: this.formData.position,
    };

    const errors = validateEmployeeForm(employee);
    if (Object.keys(errors).length > 0) {
      this.errors = errors;
      return;
    }

    if (this.currentEmployee) {
      store.updateEmployee(this.currentEmployee.id, employee);
    } else {
      store.addEmployee(employee);
    }

    this._closeModal();
  }

  _handleCancel() {
    this._closeModal();
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <form-group .error="${this.errors.firstName}" inputName="firstName">
          <text-input
            inputName="firstName"
            required
            .value=${this.formData.firstName}
            @value-changed=${this._handleInputChange}
          ></text-input>
        </form-group>

        <form-group .error="${this.errors.lastName}" inputName="lastName">
          <text-input
            inputName="lastName"
            required
            .value=${this.formData.lastName}
            @value-changed=${this._handleInputChange}
          ></text-input>
        </form-group>

        <form-group
          .error="${this.errors.dateOfEmployment}"
          inputName="dateOfEmployment"
        >
          <text-input
            inputName="dateOfEmployment"
            required
            type="date"
            .value=${this.formData.dateOfEmployment}
            @value-changed=${this._handleInputChange}
          ></text-input>
        </form-group>

        <form-group .error="${this.errors.dateOfBirth}" inputName="dateOfBirth">
          <text-input
            inputName="dateOfBirth"
            required
            type="date"
            .value=${this.formData.dateOfBirth}
            @value-changed=${this._handleInputChange}
          ></text-input>
        </form-group>

        <form-group
          .error="${this.errors.phoneNumber}"
          .helperText="${i18n.t('employees.form.helpers.phoneNumber')}"
          inputName="phoneNumber"
        >
          <text-input
            inputName="phoneNumber"
            required
            type="tel"
            .value=${this.formData.phoneNumber}
            @value-changed=${this._handleInputChange}
          ></text-input>
        </form-group>

        <form-group .error="${this.errors.email}" inputName="email">
          <text-input
            inputName="email"
            required
            type="email"
            .value=${this.formData.email}
            @value-changed=${this._handleInputChange}
          ></text-input>
        </form-group>

        <form-group .error="${this.errors.department}" inputName="department">
          <select-input
            inputName="department"
            .options="${Object.values(DEPARTMENTS)}"
            required
            .value=${this.formData.department}
            @value-changed=${this._handleInputChange}
          ></select-input>
        </form-group>

        <form-group .error="${this.errors.position}" inputName="position">
          <select-input
            inputName="position"
            .options="${Object.values(POSITIONS)}"
            required
            .value=${this.formData.position}
            @value-changed=${this._handleInputChange}
          ></select-input>
        </form-group>

        <div class="actions">
          <button type="button" @click=${this._handleCancel}>
            ${i18n.t('employees.form.cancel')}
          </button>
          <button type="submit">${i18n.t('employees.form.save')}</button>
        </div>
      </form>
    `;
  }
}

window.customElements.define('employee-form', EmployeeFormModal);
