<script setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { ChevronsUpDown, Plus } from 'lucide-vue-next'
import { ref } from 'vue'
// const props = defineProps<{
//   teams: {
//     name: string
//     logo: Component
//     plan: string
//   }[]
// }>()

const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
})
const { isMobile } = useSidebar()
const activeTeam = ref(props.teams[0])
</script>
<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-500 text-sidebar-primary-foreground">
              <img :src="activeTeam.logo" class="size-7" />
            </div>
            <div class="grid flex-1 text-left text-base leading-tight">
              <span class="truncate font-semibold">
                {{ activeTeam.name }}
              </span>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>