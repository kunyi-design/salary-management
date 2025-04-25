<template>
  <section class="px-4 grid">
    <div class="flex justify-end mb-10 gap-3">
      <div class="flex gap-3">
        <Select v-model="timeSheetValue">
          <SelectTrigger>
            <SelectValue placeholder="Chọn thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="item in timeSheets" :key="item.code" :value="item.code">
                {{ item.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="primary" @click="dataSynchronization">
          <Search />
        </Button>
      </div>
      <div class="flex gap-3">

        <Dialog v-model:open="isOpen">
          <DialogTrigger as-child>
            <Button variant="primary">
              <FileUp />
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nhập bảng chấm công</DialogTitle>
            </DialogHeader>
            <label for="fileInput" class="border border-dashed flex justify-center py-10 cursor-pointer rounded-xl">
              <p v-if="fileName" class="text-center mt-4 text-sm text-gray-600">
                Đã chọn: <strong>{{ fileName }}</strong>
              </p>
              <FileUp v-else class="w-10 h-10 text-gray-400" />
            </label>
            <input type="file" class="hidden" id="fileInput" ref="fileInput" @change="handleFileChange" />
            <DialogFooter>
              <Button type="button" variant="primary" @click="importExcel">
                Nhập
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    <div class="rounded-sm border w-full overflow-hidden mb-3">
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
        <TableBody v-if="isLoading">
          <TableRow>
            <TableCell :colspan="columns.length" class="text-center py-6">
              <span class="animate-pulse text-gray-500">Đang tải dữ liệu...</span>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableBody v-else>
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
    <div class="flex justify-between">
      <div class="text-sm flex items-center gap-2">
        <span>Tìm thấy {{ data.length }} bản ghi</span>
        <Select v-model="actions">
          <SelectTrigger class="cursor-pointer" :disabled="selectedCount.length === 0">
            <SelectValue placeholder="Chọn thao tác" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="refuse" class="cursor-pointer">
                Xuất bảng công
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <span>với {{ selectedCount.length }} bản ghi</span>
        <Button variant="outline" class="ml-5" @click="exportPayPeriod"
          :disabled="!actions || selectedCount.length === 0">Thực
          hiện</Button>
      </div>
    </div>
    <!-- <input type="file" ref="fileInput" />
    <button @click="importExcel">Import</button> -->
  </section>
</template>

<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toDate } from 'reka-ui/date'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { valueUpdater } from '@/lib/utils'
import { computed, h, onMounted, ref, watch } from 'vue'
import { ArrowUpDown, ChevronDown, Plus, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { CalendarIcon, FileUp } from 'lucide-vue-next'
import TimeSheetAPI from '@/services/api/TimeSheetAPI'
import { cn } from '@/lib/utils'
import PayPeriodAPI from '@/services/api/PayPeriodAPI'

const store = useStore()
const router = useRouter()

const sorting = ref([])
const columnFilters = ref([])
const columnVisibility = ref({})
const rowSelection = ref({})
const expanded = ref({})
const data = ref([])
const actions = ref(null)
const fileInput = ref(null)
const fileName = ref('')
const timeSheetValue = ref('')
const isOpen = ref(false)
const isLoading = ref(false)
const timeSheets = ref([
  { id: 1, label: '26/1/2025 - 25/2/2025', code: '26/1/2025 - 25/2/2025' },
  { id: 2, label: '26/2/2025 - 25/3/2025', code: '26/2/2025 - 25/3/2025' },
  { id: 3, label: '26/3/2025 - 25/4/2025', code: '26/3/2025 - 25/4/2025' },
  { id: 4, label: '26/4/2025 - 25/5/2025', code: '26/4/2025 - 25/5/2025' },
  { id: 5, label: '26/5/2025 - 25/6/2025', code: '26/5/2025 - 25/6/2025' },
  { id: 6, label: '26/6/2025 - 25/7/2025', code: '26/6/2025 - 25/7/2025' },
  { id: 7, label: '26/7/2025 - 25/8/2025', code: '26/7/2025 - 25/8/2025' },
  { id: 8, label: '26/8/2025 - 25/9/2025', code: '26/8/2025 - 25/9/2025' },
  { id: 9, label: '26/9/2025 - 25/10/2025', code: '26/9/2025 - 25/10/2025' },
  { id: 10, label: '26/10/2025 - 25/11/2025', code: '26/10/2025 - 25/11/2025' },
  { id: 11, label: '26/11/2025 - 25/12/2025', code: '26/11/2025 - 25/12/2025' },
])
const parseDateFromLabel = (dateStr) => {
  const [day, month, year] = dateStr.split('/')
  return new Date(`${year}-${month}-${day}`)
}
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
const selectedCount = computed(() => table.value.getSelectedRowModel().rows);
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
      const { month, year } = extractEndMonthYear(timeSheetValue.value)
      return h('a', {
        href: `/timesheet/${code}?payPeriodmonth=${timeSheetValue.value}&month=${month}&year=${year}`,
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
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const now = new Date()
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
const extractEndMonthYear = (code) => {
  const [_, end] = code.split(' - ')
  const [day, month, year] = end.split('/')
  return {
    month: parseInt(month),
    year: parseInt(year),
  }
}
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    fileName.value = file.name
  }
}
const getTimeSheet = async () => {
  isLoading.value = true
  try {
    const { month, year } = extractEndMonthYear(timeSheetValue.value)

    const res = await TimeSheetAPI.get(`/?month=${month}&year=${year}`)
    data.value = res.data
  }
  catch (e) {
    toast.error(e.message)
  } finally {
    isLoading.value = false
  }
}

const dataSynchronization = async () => {
  await getTimeSheet()
}

const exportPayPeriod = async () => {
  try {
    const employeeIds = selectedCount.value.map((i) => i.original.employee.employeeId)
    const { month, year } = extractEndMonthYear(timeSheetValue.value)
    const inputs = {
      month,
      year,
      employeeIds
    }
    await PayPeriodAPI.post(inputs)
    toast.success('Xuất bảng chấm công thành công')
    router.push('/payroll')
  }
  catch (e) {
    toast.error(e.message)
  }
}
const importExcel = async () => {
  const file = fileInput.value?.files?.[0]
  if (!file) return console.warn("Chưa chọn file!")

  const formdata = new FormData();
  const { month, year } = extractEndMonthYear(timeSheetValue.value)
  formdata.append("month", month);
  formdata.append("year", year);
  formdata.append("file", file);

  try {
    await TimeSheetAPI.import(formdata);
    toast.success("Import file thành công!");
    isOpen.value = false
    await getTimeSheet()
    fileName.value = ''
  } catch (error) {
    console.error("Lỗi import:", error);
  }
};
onMounted(async () => {
  store.dispatch('app/setBreadcrumb', {
    parentTitle: 'Lương thưởng',
    currentTitle: 'Bảng chấm công',
  })

  const today = new Date()
  const todayTimestamp = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime()

  const currentPeriod = timeSheets.value.find(item => {
    const [startStr, endStr] = item.label.split(' - ')
    const startDate = parseDateFromLabel(startStr)
    const endDate = parseDateFromLabel(endStr)

    const startTimestamp = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    ).getTime()

    const endTimestamp = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    ).getTime()

    return todayTimestamp >= startTimestamp && todayTimestamp <= endTimestamp
  })

  if (currentPeriod) {
    timeSheetValue.value = currentPeriod.code
  }

  await getTimeSheet()
})
</script>