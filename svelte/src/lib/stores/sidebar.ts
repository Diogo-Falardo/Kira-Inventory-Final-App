import { writable } from 'svelte/store';

export const sidebarOpen = writable(false);

export const toggleSidebar = () => sidebarOpen.update((v) => !v);
export const closeSidebar = () => sidebarOpen.set(false);
export const openSidebar = () => sidebarOpen.set(true);
