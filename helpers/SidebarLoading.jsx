/**
 * This will removed the sidebar disable state
 */
export function DisableSidebar() {
	document.getElementById('sidebarLoad').classList.remove('sidebar-loading');
}

/**
 * This will enable the sidebar disable state
 */
export function EnableSidebar() {
	document.getElementById('sidebarLoad').classList.add('sidebar-loading');
}

/**
 * This will sidebar enable and disable
 * state time out magic number
 * @see https://stackoverflow.com/questions/3518938/what-are-magic-numbers-in-computer-programming
 */
export const sidebarTimeout = 200;
