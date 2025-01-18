import {LitElement, css, html} from 'lit';

import i18n from '../../services/i18n';
import store from '../../services/store';

import '../shared/modal';

export class FormGroup extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 600;
    }

    input,
    select {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }

    .helper-text {
      font-size: 0.75rem;
      color: grey;
    }

    .error {
      color: red;
      font-size: 0.875rem;
    }
  `;

  static get properties() {
    return {
      error: {type: String},
      helperText: {type: String},
      inputName: {type: String},
      value: {type: String},
      language: {type: String},
    };
  }

  constructor() {
    super();

    const initialState = store.getState();
    this.language = initialState.language;

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

  render() {
    return html`
      <div class="form-group">
        <label for="${this.inputName}">
          ${i18n.t(`employees.form.${this.inputName}`)}
        </label>
        <slot></slot>
        ${this.helperText
          ? html`<p class="helper-text">${this.helperText}</p>`
          : null}
        ${this.error ? html`<span class="error">${this.error}</span>` : ''}
      </div>
    `;
  }
}

window.customElements.define('form-group', FormGroup);
