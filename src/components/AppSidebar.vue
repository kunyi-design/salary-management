<script setup>
// import { SidebarProps } from '@/components/ui/sidebar'
import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Waypoints,
  BadgeDollarSign
} from 'lucide-vue-next'
import { reactive, watch } from 'vue'

const props = defineProps({
  me: { type: Object, default: () => ({}) }
})

const data = reactive({
  user: {},
  teams: [
    {
      name: 'DEHA',
      logo: 'https://deha-soft.com/wp-content/uploads/2023/05/logo-1.png',
      plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Sơ đồ tổ chức',
      url: '#',
      icon: Waypoints,
      isActive: true,
      items: [
        {
          title: 'Nhân viên',
          url: '/',
        },
      ],
    },
    {
      title: 'Lương thưởng',
      url: '#',
      icon: BadgeDollarSign,
      isActive: true,
      items: [
        {
          title: 'Bảng lương',
          url: '/payroll',
        },
        {
          title: 'Bảng chấm công',
          url: '/timesheet',
        },
      ],
    },
  ],
})

watch(
  () => props.me,
  (newMe) => {
    if (newMe) {
      data.user = { ...newMe, avatar: `https://ui-avatars.com/api/?background=random&name=${newMe?.email}` }
    }
  },
  { deep: true }
)
</script>
<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>