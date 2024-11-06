

export default [
  {
    title: "gate.management",
    icon: { icon: "mdi-airplane-takeoff" },
    to: "gate-management",
  },
  {
    title: "user.management",
    icon: { icon: "mdi-account-outline" },
    to: "user-role-management",
  },
  {
    title: "projectManagement",
    icon: { icon: "mdi-file-tree-outline" },
    to: "forms-form-layouts",
  },
  {
    title: "workReport",
    icon: { icon: "mdi-text-box-search-outline" },
    to: "tables-data-table",
    subject: "Report",
    action: "read",
    children: [
      {
        title: 'Dashboard',
        to: 'apps-ecommerce-dashboard',
      },
    ]
  },
];
