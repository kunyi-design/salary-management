<template>
  <section class="px-4">
    <div class="flex gap-2 items-center mb-10">
      <button type="button"
        class="rounded bg-blue-500 text-white hover:bg-blue-500/90 py-1.5 px-3 text-xs font-semibold cursor-pointer">
        Cập nhật
      </button>
      <button type="button"
        class="rounded bg-blue-500 text-white hover:bg-blue-500/90 py-1.5 px-3 text-xs font-semibold cursor-pointer">
        Xác nhận
      </button>
      <button type="button"
        class="rounded bg-blue-500 text-white hover:bg-blue-500/90 py-1.5 px-3 text-xs font-semibold cursor-pointer">
        Từ chối
      </button>
      <button type="button"
        class="rounded bg-blue-500 text-white hover:bg-blue-500/90 py-1.5 px-3 text-xs font-semibold cursor-pointer">
        Đồng bộ dữ liệu
      </button>
      <button type="button"
        class="rounded bg-red-500 text-white hover:bg-red-500/90 py-1.5 px-3 text-xs font-semibold cursor-pointer">
        Xóa
      </button>
    </div>
    <div class="grid grid-cols-12 gap-5">
      <div class="col-span-3">
        <Label class="mb-2">Kỳ trả lương</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập tên kỳ trả lương" v-model="kyTraLuong" />
      </div>
      <div class="col-span-3">
        <Label class="mb-2">Từ ngày</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập ngày" value="26/03/2025" />
      </div>
      <div class="col-span-3">
        <Label class="mb-2">Đến ngày</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập ngày" value="25/04/2025" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'vee-validate'

const route = useRoute()
const store = useStore()
const kyTraLuong = ref("04/2025 - 04/2025");
onMounted(() => {
  store.dispatch('app/setBreadcrumb', {
    parentTitle: 'Bảng chấm công',
    currentTitle: `Bảng chấm công ${route.params.code}`,
  })
})
</script>