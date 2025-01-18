import {LitElement, css, html} from 'lit';

import store from '../../services/store';

import '../shared/modal';

export class TextInput extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }

    input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
  `;

  static properties = {
    inputName: {type: String},
    required: {type: Boolean},
    type: {
      type:
        'text' |
        'password' |
        'email' |
        'number' |
        'tel' |
        'url' |
        'search' |
        'date' |
        'time' |
        'datetime-local' |
        'month' |
        'week' |
        'color',
    },
    value: {type: String},
  };

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
      <input
        id="${this.inputName}"
        name="${this.inputName}"
        ?required=${this.required}
        type="${this.type ?? 'text'}"
        .value="${this.value}"
        @input=${this._handleInput}
      />
    `;
  }
}

window.customElements.define('text-input', TextInput);
