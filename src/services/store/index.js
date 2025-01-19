import {MODAL_TYPES} from '../../consts/modalTypes';
import {VIEW_MODES} from '../../consts/viewModes';

const defaultModalsState = {
  [MODAL_TYPES.DELETE]: false,
};

class EmployeeStore {
  constructor() {
    this.state = {
      employees: [],
      currentEmployee: null,
      filters: {
        search: '',
        department: '',
        position: '',
      },
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
      },
      view: VIEW_MODES.TABLE,
      modals: defaultModalsState,
      language: document.documentElement.lang || 'en',
    };
    // eslint-disable-next-line no-undef
    this.listeners = new Set();

    // Load initial state from localStorage if available
    this.loadFromStorage();
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners of state changes
  notify() {
    this.listeners.forEach((listener) => listener(this.state));
    this.saveToStorage();
  }

  // State getters
  getState() {
    return {...this.state};
  }

  getEmployees() {
    return [...this.state.employees];
  }

  getCurrentEmployee() {
    return this.state.currentEmployee ? {...this.state.currentEmployee} : null;
  }

  // State mutations
  addEmployee(employee) {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString(),
    };

    this.state.employees = [...this.state.employees, newEmployee];
    const newTotalItemsCount = this.state.employees.length;
    const newTotalPagesCount =
      Math.ceil(newTotalItemsCount / this.state.pagination.itemsPerPage) || 1;
    this.state.pagination = {
      ...this.state.pagination,
      totalItems: newTotalItemsCount,
      currentPage: newTotalPagesCount,
    };

    this.notify();
    return newEmployee;
  }

  updateEmployee(id, updates) {
    this.state.employees = this.state.employees.map((emp) =>
      emp.id === id ? {...emp, ...updates} : emp
    );
    this.notify();
  }

  deleteEmployee(id) {
    this.state.employees = this.state.employees.filter((emp) => emp.id !== id);

    const newTotalItemsCount = this.state.employees.length;
    const newTotalPagesCount =
      Math.ceil(newTotalItemsCount / this.state.pagination.itemsPerPage) || 1;
    this.state.pagination = {
      ...this.state.pagination,
      totalItems: newTotalItemsCount,
      currentPage:
        newTotalPagesCount < this.state.pagination.currentPage
          ? newTotalPagesCount
          : this.state.pagination.currentPage,
    };

    this.notify();
  }

  openModal(modal, employee) {
    this.state.currentEmployee = employee ? {...employee} : null;
    this.state.modals = {
      ...defaultModalsState,
      [modal]: Boolean(employee),
    };
    this.notify();
  }

  closeModal(modal) {
    this.state.currentEmployee = null;
    this.state.modals = {
      ...this.state.modals,
      [modal]: false,
    };
    this.notify();
  }

  updateFilters(filters) {
    this.state.filters = {...this.state.filters, ...filters};
    this.notify();
  }

  updatePagination(pagination) {
    this.state.pagination = {...this.state.pagination, ...pagination};
    this.notify();
  }

  setView(view) {
    this.state.view = view;
    this.notify();
  }

  setLanguage(language) {
    this.state.language = language;
    this.notify();
  }

  // Storage management
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('storeVal');
      if (stored) {
        this.state = {
          ...JSON.parse(stored),
          modals: defaultModalsState,
        };
      }
    } catch (error) {
      console.error('Failed to load state from storage:', error);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('storeVal', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save state to storage:', error);
    }
  }
}

const store = new EmployeeStore();
export default store;
