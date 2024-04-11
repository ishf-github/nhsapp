import { writable } from 'svelte/store';

export const includeRightButton = writable(false);
export const showFilters = writable(false);
export const showReferral = writable(false);
export const showPrescription = writable(false);
export const statusFilter = writable('All');

export const setStatusFilter = (status) => {
    statusFilter.set(status);
  };