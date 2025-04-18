<template>
  <section class="px-4 grid">
    <div class="flex justify-end mb-10 gap-3">
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" :class="cn(
            'w-[280px] justify-start text-left font-normal',
            !dateOfIssueValue && 'text-muted-foreground',
          )">
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{ dateOfIssueValue ? df.format(dateOfIssueValue.toDate(getLocalTimeZone())) : "Pick a date" }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar v-model="dateOfIssueValue" initial-focus />
        </PopoverContent>
      </Popover>
      <Button variant="primary" @click="dataSynchronization">
        <Search />
      </Button>
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
    <div class="flex justify-between">
      <div class="text-sm flex items-center gap-2">
        <span>Tìm thấy {{ data.length }} bản ghi</span>
        <Select v-model="actions">
          <SelectTrigger class="cursor-pointer" :disabled="selectedCount.length === 0">
            <SelectValue placeholder="Chọn thao tác" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <!-- <SelectItem value="approve" class="cursor-pointer">
                Phê duyệt
              </SelectItem>
              <SelectItem value="refuse" class="cursor-pointer">
                Từ chối
              </SelectItem> -->
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
    <input type="file" ref="fileInput" />
    <button @click="importExcel">Import</button>
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
import { toast } from 'vue-sonner'
import { CalendarIcon } from 'lucide-vue-next'
import TimeSheetAPI from '@/services/api/TimeSheetAPI'
import { cn } from '@/lib/utils'
import PayPeriodAPI from '@/services/api/PayPeriodAPI'

const store = useStore()

const sorting = ref([])
const columnFilters = ref([])
const columnVisibility = ref({})
const rowSelection = ref({})
const expanded = ref({})
const data = ref([])
const actions = ref(null)
const fileInput = ref(null)
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
const dateOfIssueValue = ref(new CalendarDate(now.getFullYear(), now.getMonth() + 1, 1))
const getTimeSheet = async () => {
  try {
    const year = dateOfIssueValue.value.year
    const month = dateOfIssueValue.value.month

    const res = await TimeSheetAPI.get(`/?month=${month}&year=${year}`)
    data.value = res.data
  }
  catch (e) {
    toast.error(e.message)
  }
}

const dataSynchronization = async () => {
  await getTimeSheet()
}

const exportPayPeriod = async () => {
  try {
    const employeeIds = selectedCount.value.map((i) => i.original.employee.employeeId)
    const inputs = {
      month: dateOfIssueValue.value.month,
      year: dateOfIssueValue.value.year,
      employeeIds
    }
    const res = await PayPeriodAPI.post(inputs)
  }
  catch (e) {
    toast.error(e.message)
  }
}
const importExcel = async () => {
  const file = fileInput.value?.files?.[0]
  if (!file) return console.warn("Chưa chọn file!")

  const formdata = new FormData();
  formdata.append("month", "5");
  formdata.append("year", "2025");
  formdata.append("file", file);

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmUwYWJkYzNhZmYzMzNkNTk2MGI1YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NDk4NTkyOCwiZXhwIjoxNzQ1MDcyMzI4fQ.kt8iXug_meLAyVLKANlggOcFpl4_Q-XWyjCVlRfxTt0",
    },
    body: formdata,
  };

  try {
    const response = await fetch("https://api-qlns.onrender.com/api/attendance/import", requestOptions);
    const result = await response.json();
    console.log("Kết quả import:", result);
  } catch (error) {
    console.error("Lỗi import:", error);
  }
};
onMounted(() => {
  getTimeSheet()
  store.dispatch('app/setBreadcrumb', {
    parentTitle: 'Lương thưởng',
    currentTitle: 'Bảng chấm công',
  })

})
</script>