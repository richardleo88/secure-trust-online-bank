
import { UserCrudService } from './admin/userCrud';
import { UserStatusService } from './admin/userStatus';
import { RoleManagementService } from './admin/roleManagement';
import { BalanceManagementService } from './admin/balanceManagement';
import { RequestManagementService } from './admin/requestManagement';
import { SearchAndFilterService } from './admin/searchAndFilter';

// Re-export types for backward compatibility
export type { AdminUser, UserRequest, UserFilters } from './admin/types';

// Main AdminUserService class that combines all services
export class AdminUserService {
  // User CRUD Operations
  static getAllUsers = UserCrudService.getAllUsers;
  static getUserById = UserCrudService.getUserById;
  static createUser = UserCrudService.createUser;
  static updateUser = UserCrudService.updateUser;
  static deleteUser = UserCrudService.deleteUser;

  // User Status Management
  static activateUser = UserStatusService.activateUser;
  static deactivateUser = UserStatusService.deactivateUser;
  static approveUser = UserStatusService.approveUser;
  static rejectUser = UserStatusService.rejectUser;

  // Role Management
  static assignAdminRole = RoleManagementService.assignAdminRole;
  static revokeAdminRole = RoleManagementService.revokeAdminRole;

  // Balance Management
  static adjustBalance = BalanceManagementService.adjustBalance;

  // Request Management
  static getAllRequests = RequestManagementService.getAllRequests;
  static approveRequest = RequestManagementService.approveRequest;
  static rejectRequest = RequestManagementService.rejectRequest;

  // Search and Filter
  static searchUsers = SearchAndFilterService.searchUsers;
  static filterUsers = SearchAndFilterService.filterUsers;
}
