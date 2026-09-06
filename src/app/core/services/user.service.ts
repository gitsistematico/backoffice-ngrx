import { Injectable } from "@angular/core";
import { AdminUser } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class UserService {
  getMockUsers(): AdminUser[] {
    return [
      {
        id: "1",
        name: "Carlos Pérez",
        email: "carlos.perez@betterlife.io",
        role: "admin",
        route: "eses-main",
        status: "active",
        createdAt: new Date("2024-09-01"),
        lastLogin: new Date("2025-07-16T09:10:00"),
        initials: "CP",
        avatarColor: "#c8e6c9",
      },
      {
        id: "2",
        name: "María Gómez",
        email: "maria.gomez@betterlife.io",
        role: "agent",
        route: "eses-main",
        status: "active",
        createdAt: new Date("2024-10-15"),
        lastLogin: new Date("2025-07-15T17:30:00"),
        initials: "MG",
        avatarColor: "#b2dfdb",
      },
      {
        id: "3",
        name: "Lucas Fernández",
        email: "lucas.fernandez@betterlife.io",
        role: "supervisor",
        route: "eses-main",
        status: "active",
        createdAt: new Date("2025-01-10"),
        lastLogin: new Date("2025-07-16T08:00:00"),
        initials: "LF",
        avatarColor: "#ffe0b2",
      },
      {
        id: "4",
        name: "Sophie Bernard",
        email: "sophie.bernard@betterlife.io",
        role: "agent",
        route: "eses-main",
        status: "inactive",
        createdAt: new Date("2025-02-20"),
        lastLogin: new Date("2025-06-30T14:00:00"),
        initials: "SB",
        avatarColor: "#f8bbd0",
      },
      {
        id: "5",
        name: "Diego Sanz",
        email: "diego.sanz@betterlife.io",
        role: "agent",
        route: "eses-main",
        status: "active",
        createdAt: new Date("2025-03-05"),
        lastLogin: new Date("2025-07-14T11:20:00"),
        initials: "DS",
        avatarColor: "#e1bee7",
      },
    ];
  }
}
