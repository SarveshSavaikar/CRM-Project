export * from "./companies";
export * from "./dashboard";
export * from "./login";
export * from "./tasks";
export * from "./deals";
export * from "./customer";

export * from "./leads/list";
export * from "./geoinsights/list";
export * from "./campagins"; // Note: Typo in 'campaigns' here, might be intentional.

// Import and re-export the AdminSettingsPage and AuditLog components explicitly
// to avoid conflicts with 'boxStyle' or any other shared names.
import { AdminSettingsPage } from "./admin";
import { AuditLog } from "./admin/auditlog";

export { AdminSettingsPage, AuditLog };