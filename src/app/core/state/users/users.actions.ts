import { createActionGroup, props } from '@ngrx/store';
import { AdminUser } from '../../models/user.model';

export const UserActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': props<{ users: AdminUser[] }>(),
    'Add User': props<{ user: { name: string; email: string; role: AdminUser['role']; route: string; status: AdminUser['status'] } }>(),
    'Update User': props<{ id: string; changes: Partial<AdminUser> }>(),
    'Delete User': props<{ id: string }>(),
  },
});
