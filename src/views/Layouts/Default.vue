<script>
export const description
  = 'A sidebar that collapses to icons.'
export const iframeHeight = '800px'
export const containerClass = 'w-full h-full'
</script>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import AuthAPI from '@/services/api/AuthAPI'
import { useStore } from 'vuex'

const store = useStore()
const parentBreadcrumb = ref('')
const currentBreadcrumb = ref('')
const me = ref({})

const changeBreadcrumb = (breadcrumb) => {
  console.log('ok')
  parentBreadcrumb.value = breadcrumb.parentTitle
  currentBreadcrumb.value = breadcrumb.currentTitle || ''
}

const getStoreBreadcrumb = computed(() => store.state.app.breadcrumbs)
watch(() => getStoreBreadcrumb.value, (newVal) => {
  parentBreadcrumb.value = newVal.parentTitle
  currentBreadcrumb.value = newVal.currentTitle
})
onMounted(() => {
  getMe()
})

const getMe = async () => {
  try {
    const res = await AuthAPI.get('/me')
    me.value = res
  }
  catch (err) {
    console.log(err.message)
  }
}
</script>
<template>
  <div class="group/sidebar-wrapper h-full w-full" data-collapsible="icon">
    <SidebarProvider>
      <AppSidebar :me="me" />
      <SidebarInset>
        <header
          class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink href="#">
                    {{ parentBreadcrumb }}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="currentBreadcrumb" class="hidden md:block" />
                <BreadcrumbItem v-if="currentBreadcrumb">
                  <BreadcrumbPage>{{ currentBreadcrumb }}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <RouterView />
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
