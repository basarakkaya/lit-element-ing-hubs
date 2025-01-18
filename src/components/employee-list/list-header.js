import {LitElement, css, html} from 'lit';

import i18n from '../../services/i18n';
import store from '../../services/store';
import {VIEW_MODES} from '../../consts/viewModes';

export class Header extends LitElement {
  static styles = css`
    :host {
      display: flex;
      gap: 0.1rem;
    }

    .employees-list-title {
      color: #ff6b00;
      flex-grow: 1;
    }

    .view-button {
      height: 2rem;
      width: 2rem;
      border: 1px solid #ff6b00;
      border-radius: 4px;
      background-color: white;
      color: #ff6b00;
      cursor: pointer;
      align-self: center;
    }

    .view-button:hover {
      background-color: #f5f5f5;
    }

    .view-button.active {
      background-color: #ff6b00;
      color: white;
    }
  `;

  static get properties() {
    return {
      view: {type: String},
    };
  }

  constructor() {
    super();

    const initialState = store.getState();

    this.view = initialState.view;

    this.unsubscribe = store.subscribe((state) => {
      const updates = {
        language: state.language,
        view: state.view,
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
      <h1 class="employees-list-title">${i18n.t('employees.list.title')}</h1>
      ${Object.values(VIEW_MODES).map(
        (viewMode) =>
          html`<button
            class="${`view-button ${this.view === viewMode ? 'active' : ''}`}"
            @click=${() => this._setViewMode(viewMode)}
          >
            ${viewMode}
          </button>`
      )}
    `;
  }
}

window.customElements.define('list-header', Header);
