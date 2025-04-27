<template>
  <section class="px-4 grid">
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
        class="rounded bg-red-500 text-white hover:bg-red-500/90 py-1.5 px-3 text-xs font-semibold cursor-pointer">
        Xóa
      </button>
    </div>
    <div class="grid grid-cols-12 gap-5 mb-5">
      <div class="col-span-3">
        <Label class="mb-2">Tên kỳ trả lương</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập tên kỳ trả lương" v-model="namePayPeriod" />
      </div>
      <!-- <div class="col-span-3">
        <Label class="mb-2">Tên kỳ tài chính</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="" v-model="fiscalPeriodName" />
      </div> -->
      <div class="col-span-6">
        <Label class="mb-2">Tên công ty</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập tên công ty" v-model="companyName" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-5 mb-5">
      <div class="col-span-3">
        <Label class="mb-2">Từ ngày</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Từ ngày" v-model="fromDate" />
      </div>
      <div class="col-span-3">
        <Label class="mb-2">Đến ngày</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Đến ngày" v-model="toDate" />
      </div>
      <div class="col-span-3">
        <Label class="mb-2">Số ngày</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Số ngày" v-model="numberOfDays" />
      </div>
    </div>

    <div class="rounded-sm border w-full overflow-hidden">
      <Table class=" relative">
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead :class="header.column.columnDef.meta?.cellClass" v-for="header in headerGroup.headers"
              :key="header.id" :colspan="header.colSpan"
              class="text-center text-sm font-semibold text-gray-700 bg-gray-50 border-x border-gray-300">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell :class="cell.column.columnDef.meta?.cellClass" v-for="cell in row.getVisibleCells()"
                  :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells()">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </section>
</template>

<script setup>
import PayPeriodAPI from '@/services/api/PayPeriodAPI';
import { toast } from 'vue-sonner';
import { useRoute } from 'vue-router';
import { onMounted, ref, computed, h } from 'vue';
import { useStore } from 'vuex';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ChevronDown, Plus } from 'lucide-vue-next'
import { formatCurrency } from '../utils/formats'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'

const store = useStore()
const route = useRoute()
const sorting = ref([])
const columnFilters = ref([])
const columnVisibility = ref({})
const rowSelection = ref({})
const expanded = ref({})
const dataTable = ref([])
const namePayPeriod = ref('')
const fiscalPeriodName = ref('')
const companyName = ref('')
const numberOfDays = ref('')
const fromDate = ref('')
const toDate = ref('')
const getPayPeriod = async () => {
  try {
    const id = route.params.id
    const res = await PayPeriodAPI.get('/' + id)
    namePayPeriod.value = res.data.payPeriod.namePayPeriod
    companyName.value = res.data.payPeriod.company
    numberOfDays.value = res.data.salaries[0]?.attendanceSummary?.totalDays || 0
    fromDate.value = res.data.fromDate
    toDate.value = res.data.toDate
    dataTable.value = res.data.salaries
  }
  catch (e) {
    toast.error(e.message)
  }
}
const moneyColumn = (key, title) => ({
  accessorKey: key,
  header: ({ column }) => {
    return h('div', {
      class: 'w-full text-gray-700 text-center',
    }, title);
  },
  cell: ({ row }) => {
    const value = row.getValue(key);
    return h('div', {
      class: 'text-center',
    }, value ? formatCurrency(value) : '');
  },
});

const columns = [

  {
    id: 'stt',
    header: 'STT',
    cell: ({ row }) => h('div', { class: 'text-center' }, row.index + 1),
  },
  {
    accessorKey: 'employeeId',
    header: 'Mã nhân viên',
    cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('employeeId')),
  },
  {
    accessorKey: 'fullName',
    header: 'Tên nhân viên',
    cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('fullName')),
  },
  moneyColumn('basicSalary', 'Lương cơ bản'),
  {
    header: 'Phụ cấp / Trợ cấp',
    columns: [
      moneyColumn('responsibilityAllowance', 'Phụ cấp trách nhiệm'),
      moneyColumn('transportAllowance', 'Phụ cấp xăng xe'),
      moneyColumn('phoneAllowance', 'Phụ cấp điện thoại'),
      moneyColumn('lunchAllowance', 'Phụ cấp ăn trưa'),
      moneyColumn('childrenAllowance', 'Phụ cấp nuôi con nhỏ'),
      moneyColumn('attendanceAllowance', 'Phụ cấp chuyên cần'),
      moneyColumn('seniorityAllowance', 'Phụ cấp thâm niên'),
    ],
  },
  moneyColumn('totalSalaryGross', 'Tổng thu nhập'),
  moneyColumn('totalSalaryNet', 'Thực nhận'),
  moneyColumn('employeeInsurance', 'Bảo hiểm nhân viên đóng'),
  {
    accessorKey: 'personalIncomeTax',
    header: () => h('div', { class: 'text-center text-sm font-semibold text-gray-700' }, 'Thuế TNCN'),
    cell: ({ row }) => {
      return h(Input, {
        modelValue: formatCurrency(row.getValue('personalIncomeTax')),
        disabled: true,
        class: 'bg-gray-100 w-28'
      })
    }
  },
];


const dateColumns = computed(() => {
  if (!dataTable.value.length) return columns


  return [...columns]
})

const table = computed(() => useVueTable({
  data: dataTable.value,
  columns: dateColumns.value,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
  },
}))
onMounted(async () => {
  await getPayPeriod()
  await store.dispatch('app/setBreadcrumb', {
    parentTitle: 'Bảng lương',
    currentTitle: namePayPeriod.value,
  })
})
</script>