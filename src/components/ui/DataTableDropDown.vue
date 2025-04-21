<script setup>
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash } from 'lucide-vue-next'
import { defineEmits } from 'vue'

const emit = defineEmits(['delete, edit'])
defineProps({
  payment: {
    type: Object,
    required: true
  }
}
)

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem class=" cursor-pointer" @click="emit('edit')">
        <Pencil class="!w-4" />Sửa
      </DropdownMenuItem>
      <DropdownMenuItem class=" cursor-pointer" @click="emit('delete')">
        <Trash class="!w-4" />Xóa
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>