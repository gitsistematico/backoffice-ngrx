export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'supervisor';
  route: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  lastLogin?: Date;
  initials: string;
  avatarColor: string;
}
