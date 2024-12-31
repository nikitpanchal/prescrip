export function getAssistantRoleData(roleType) {
  switch (roleType) {
    case "Receptionist":
      return {
        permissions: [
          "-Appointments",
          "-Patient Details (Basic Details)",
          "-Medical Investications",
          "-Notes",
          "-Clinic Settings",
          "-Invoice and Receipt",
          "-Doctor Profile (Share only)",
        ],
      };

    case "Medical Assistant":
      return {
        permissions: [
          "-Appointments",
          "-Patient Details (Basic Details)",
          "-Medical Investications",
          "-Notes",
          "-Clinic Settings",
          "-Invoice and Receipt",
          "-Doctor Profile (Share only)",
        ],
      };

    case "Assistant Doctor":
      return {
        permissions: ["-Full Access", "-Medical Investigations (no delete)"],
      };
    default:
      return {
        permissions: [],
      };
  }
}
