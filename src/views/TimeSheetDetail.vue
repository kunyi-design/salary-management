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
        class="rounded bg-blue-500 text-white hover:bg-blue-500/90 py-1.5 px-3 text-xs font-semibold cursor-pointer">
        Đồng bộ dữ liệu
      </button>
      <button type="button"
        class="rounded bg-red-500 text-white hover:bg-red-500/90 py-1.5 px-3 text-xs font-semibold cursor-pointer">
        Xóa
      </button>
    </div>
    <div class="grid grid-cols-12 gap-5 mb-5">
      <div class="col-span-3">
        <Label class="mb-2">Kỳ trả lương</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập tên kỳ trả lương" v-model="kyTraLuong" />
      </div>
      <div class="col-span-3">
        <Label class="mb-2">Từ ngày</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập ngày" v-model="fromDate" />
      </div>
      <div class="col-span-3">
        <Label class="mb-2">Đến ngày</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập ngày" v-model="toDate" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-5 mb-5">
      <div class="col-span-3">
        <Label class="mb-2">Phép tồn tháng trước</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập phép tồn tháng trước" v-model="survival" />
      </div>
      <div class="col-span-3">
        <Label class="mb-2">Phép còn lại tháng này</Label>
        <Input type="text" disabled class="bg-gray-100" placeholder="Nhập phép còn lại tháng này"
          v-model="remainingPermission" />
      </div>
    </div>
    <div class="rounded-sm border w-full overflow-hidden">
      <Table class=" relative">
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead :class="header.column.columnDef.meta?.cellClass" v-for="header in headerGroup.headers"
              :key="header.id">
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
import { computed, h, onMounted, ref, watch } from 'vue';
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
import { ArrowUpDown, ChevronDown, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from 'vuex';
import { toast } from 'vue-sonner'
import TimeSheetAPI from '@/services/api/TimeSheetAPI';

const route = useRoute()
const store = useStore()
const kyTraLuong = ref("");
const fromDate = ref("")
const toDate = ref('')
const survival = ref(2)
const remainingPermission = ref(3)

const sorting = ref([])
const columnFilters = ref([])
const columnVisibility = ref({})
const rowSelection = ref({})
const expanded = ref({})
const data = ref([])
// const fileInput = ref(null)
const dateColumns = computed(() => {
  if (!data.value.length) return columns;

  const createSummaryColumn = (key, label, width = 'w-16') => ({
    accessorKey: key,
    accessorFn: row => row.summary?.[key],
    header: () =>
      h('div', {
        class: `${width} whitespace-break-spaces text-gray-700 text-center`,
      }, label),
    cell: ({ row }) =>
      h('span', { class: 'text-center block' }, row.getValue(key) ?? '')
  });

  const createDynamicDateColumn = (item, index) => ({
    id: `date-${index}`,
    header: () => [
      h('div', { class: 'text-center py-2 font-bold px-4' }, new Date(item.date).getDate()),
      h('hr'),
      h('div', {
        class: 'text-center text-sm text-gray-500 px-4 py-2 bg-gray-100'
      }, item.dayOfWeek)
    ],
    cell: ({ row }) => {
      const attendance = row.original.attendanceData?.[index];
      return h('div', { class: 'text-center' }, attendance?.value ?? '');
    },
    meta: {
      headClass: 'px-0',
      cellClass: 'px-0',
    }
  });

  const dynamicColumns = data.value[0].attendanceData.map(createDynamicDateColumn);

  const summaryColumns = [
    createSummaryColumn('offDays', 'Số ngày nghỉ'),
    createSummaryColumn('halfDays', 'Số ngày nghỉ nửa ngày'),
    createSummaryColumn('fullDays', 'Số ngày đi làm'),
    createSummaryColumn('workingDays', 'Số ngày đi làm thực tế'),
  ];

  return [...columns, ...dynamicColumns, ...summaryColumns];
});
const columns = [
  {
    id: 'stt',
    header: () => h('div', { class: 'text-center text-sm font-semibold text-gray-700' }, 'STT'),
    cell: ({ row }) => h('div', { class: 'text-center' }, row.index + 1),
  },
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        modelValue: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'employeeId',
    accessorFn: row => row.employee?.employeeId,
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        class: 'w-full text-gray-700 text-center',
      }, () => ['Mã nhân viên', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]);
    },
    cell: ({ row }) => {
      const code = row.getValue('employeeId');
      return h('a', {
        href: `/timesheet/${code}`,
        class: 'text-center text-blue-500 block underline hover:text-blue-700',
      }, code);
    },
  },
  {
    accessorKey: 'fullName',
    accessorFn: row => row.employee?.fullName,
    header: ({ column }) => {
      return h('div', {
        class: 'w-full text-gray-700 text-center',
      }, 'Tên nhân viên');
    },
    cell: ({ row }) => {
      const code = row.getValue('fullName');
      return h('span', {
        class: 'text-center block',
      }, code);
    },
    meta: {
      headClass: 'sticky left-0 bg-white',
      cellClass: 'sticky left-0 bg-white',
    }
  },
  {
    accessorKey: 'position',
    accessorFn: row => row.employee?.position,
    header: ({ column }) => {
      return h('div', {
        class: 'w-full text-gray-700 text-center',
      }, 'Vị trí');
    },
    cell: ({ row }) => {
      const code = row.getValue('position');
      return h('div', {
        class: 'text-center block',
      }, code);
    },
  },
  {
    accessorKey: 'department',
    accessorFn: row => row.employee?.department,
    header: ({ column }) => {
      return h('div', {
        class: 'w-full text-gray-700 text-center',
      }, 'Ban / Trung tâm');
    },
    cell: ({ row }) => {
      const code = row.getValue('department');
      return h('span', {
        class: 'text-center block',
      }, code);
    },
  },
];
const getTimeSheetDetail = async () => {
  try {
    const res = await TimeSheetAPI.get(`/employee?employeeId=${route.params.code}&month=${route.query.month}&year=${route.query.year}`)
    data.value = res.data
  }
  catch (e) {
    toast
  }
}
const table = computed(() => useVueTable({
  data: data.value,
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
  await getTimeSheetDetail()
  store.dispatch('app/setBreadcrumb', {
    parentTitle: 'Bảng chấm công',
    currentTitle: `Bảng chấm công ${route.params.code}`,
  })
  const [start, end] = route.query.payPeriodmonth.split(' - ')
  kyTraLuong.value = route.query.payPeriodmonth
  fromDate.value = start
  toDate.value = end
})
</script>