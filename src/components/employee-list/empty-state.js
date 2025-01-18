import {LitElement, css, html} from 'lit';

import i18n from '../../services/i18n';
import store from '../../services/store';

export class EmptyState extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .no-results {
      text-align: center;
    }
  `;

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

  render() {
    return html`<h2 class="no-results">
      ${i18n.t('employees.list.noResults')}
    </h2> `;
  }
}

window.customElements.define('empty-state', EmptyState);
