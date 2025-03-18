export default [
  {
    title: 'gate.management',
    icon: { icon: 'mdi-airplane-takeoff' },
    to: 'um-gate',
  },
  {
    title: 'user.management',
    icon: { icon: 'mdi-account-outline' },
    to: 'um-user',
  },
  {
    title: 'projectManagement',
    icon: { icon: 'mdi-file-tree-outline' },
    to: 'um-project',
  },
  {
    title: 'workReport',
    icon: { icon: 'mdi-text-box-search-outline' },
    to: 'tables-data-table',
    subject: 'Report',
    action: 'read',
    children: [
      {
        title: 'Dashboard',
        to: 'apps-ecommerce-dashboard',
      },
    ],
  },
]
