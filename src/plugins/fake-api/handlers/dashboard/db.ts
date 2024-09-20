import type { ProjectAnalytics } from '@db/dashboard/type'

import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'
import figma from '@images/icons/project-icons/figma.png'
import html5 from '@images/icons/project-icons/html5.png'
import python from '@images/icons/project-icons/python.png'
import react from '@images/icons/project-icons/react.png'
import sketch from '@images/icons/project-icons/sketch.png'
import vue from '@images/icons/project-icons/vue.png'
import xamarin from '@images/icons/project-icons/xamarin.png'

interface DB {
  analytics: ProjectAnalytics[]
}

export const db: DB = {
  analytics: [
    {
      logo: react,
      name: 'BGC eCommerce App',
      project: 'React Project',
      leader: 'Eileen',
      progress: 78,
      hours: '18:42',
      team: [avatar1, avatar8, avatar6],
      extraMembers: 3,
    },
    {
      logo: figma,
      name: 'Falcon Logo Design',
      project: 'Figma Project',
      leader: 'Owen',
      progress: 25,
      hours: '20:42',
      team: [avatar5, avatar2],
    },
    {
      logo: vue,
      name: 'Dashboard Design',
      project: 'Vuejs Project',
      leader: 'Keith',
      progress: 62,
      hours: '120:87',
      team: [avatar8, avatar2, avatar1],
    },
    {
      logo: xamarin,
      name: 'Foodista mobile app',
      project: 'Xamarin Project',
      leader: 'Merline',
      progress: 8,
      hours: '120:87',
      team: [avatar3, avatar4, avatar7],
      extraMembers: 8,
    },
    {
      logo: python,
      name: 'Dojo Email App',
      project: 'Python Project',
      leader: 'Harmonia',
      progress: 51,
      hours: '230:10',
      team: [avatar4, avatar3, avatar1],
      extraMembers: 5,
    },
    {
      logo: sketch,
      name: 'Blockchain Website',
      project: 'Sketch Project',
      leader: 'Allyson',
      progress: 92,
      hours: '342:41',
      team: [avatar1, avatar8],
    },
    {
      logo: html5,
      name: 'Hoffman Website',
      project: 'HTML Project',
      leader: 'Georgie',
      progress: 80,
      hours: '12:45',
      team: [avatar1, avatar8, avatar6],
    },

  ],
}
