import {LitElement, css, html} from 'lit';
import 'fa-icons';

import store from '../../services/store';

import '../shared/modal';

export class Pagination extends LitElement {
  static styles = css`
    :host {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      justify-content: center;
      margin: 2rem 0;
    }

    button {
      min-width: 2rem;
      height: 2rem;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 1rem;
      color: #666;
      font-size: 0.875rem;
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button:hover:not(:disabled) {
      background-color: #f5f5f5;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .prev-next {
      color: #ff6b00;
    }

    .active {
      background-color: #ff6b00 !important;
      color: white;
    }

    .page-button {
      min-width: 2rem;
    }
  `;

  static properties = {
    pagination: {type: Object},
  };

  constructor() {
    super();

    const initialState = store.getState();

    this.pagination = initialState.pagination;

    this.unsubscribe = store.subscribe((state) => {
      const updates = {
        language: state.language,
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

  _goToPreviousPage() {
    store.updatePagination({
      ...this.pagination,
      currentPage: this.pagination.currentPage - 1,
    });
  }

  _goToNextPage() {
    store.updatePagination({
      ...this.pagination,
      currentPage: this.pagination.currentPage + 1,
    });
  }

  _goToPageNumber(pageNumber) {
    store.updatePagination({
      ...this.pagination,
      currentPage: pageNumber,
    });
  }

  render() {
    const pagesCount = Math.ceil(
      this.pagination.totalItems / this.pagination.itemsPerPage
    );
    return html`
      <button
        class="prev-next"
        @click=${this._goToPreviousPage}
        ?disabled=${this.pagination.currentPage === 1}
      >
        <fa-icon class="fas fa-chevron-left" size="1em"></fa-icon>
      </button>
      ${[...Array(pagesCount)].map(
        (page, pageIndex) => html`
          <button
            class=${`page-button ${
              pageIndex + 1 === this.pagination.currentPage ? 'active' : ''
            }`}
            @click=${() => this._goToPageNumber(pageIndex + 1)}
          >
            ${pageIndex + 1}
          </button>
        `
      )}
      <button
        class="prev-next"
        @click=${this._goToNextPage}
        ?disabled=${this.pagination.currentPage === pagesCount}
      >
        <fa-icon class="fas fa-chevron-right" size="1em"></fa-icon>
      </button>
    `;
  }
}

window.customElements.define('list-pagination', Pagination);
