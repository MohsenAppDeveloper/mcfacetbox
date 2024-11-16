

export default [
  {
    title: "gate.management",
    icon: { icon: "mdi-airplane-takeoff" },
    to: "umgate-management",
  },
  {
    title: "user.management",
    icon: { icon: "mdi-account-outline" },
    to: "umuser-role-management",
  },
  {
    title: "projectManagement",
    icon: { icon: "mdi-file-tree-outline" },
    to: "umproject-management",
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
