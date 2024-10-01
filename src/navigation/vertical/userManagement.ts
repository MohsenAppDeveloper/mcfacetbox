

export default [
  {
    title: "gateManagement",
    icon: { icon: "mdi-airplane-takeoff" },
    to: "dashboards-analytics",
  },
  {
    title: "userManagement",
    icon: { icon: "mdi-account-outline" },
    to: "forms-autocomplete",
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
