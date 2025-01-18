import {LitElement, css, html} from 'lit';

import i18n from '../../services/i18n';
import store from '../../services/store';

import '../shared/modal';

export class SelectInput extends LitElement {
  static styles = css`
    :host {
      display: flex;
    }

    select {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      width: 100%;
    }
  `;

  static get properties() {
    return {
      inputName: {type: String},
      options: {type: Array},
      required: {type: Boolean},
      value: {type: String},
    };
  }

  constructor() {
    super();

    this.required = false;

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

  _handleInput(e) {
    const value = e.target.value;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: {
          value,
          field: this.inputName,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <select
        id="${this.inputName}"
        name="${this.inputName}"
        ?required=${this.required}
        .value=${this.value}
        @input=${this._handleInput}
      >
        <option value="">${i18n.t('employees.form.select')}</option>
        ${this.options.map(
          (value) => html`
            <option value=${value}>
              ${i18n.t(`employees.form.${this.inputName}s.${value}`)}
            </option>
          `
        )}
      </select>
    `;
  }
}

window.customElements.define('select-input', SelectInput);
