<script setup>
import { valueUpdater } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Input } from '@/components/ui/input'
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
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import DataTableDropDown from '../ui/DataTableDropDown.vue'
import { h, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import EmployeeAPI from '@/services/api/EmployeeAPI'

const router = useRouter()
const props = defineProps({
  data: { type: Array, default: () => ([]) },
  isLoading: { type: Boolean, default: false },
})
const emits = defineEmits(['refresh-table'])
const createCell = (key, label) => {
  return {
    accessorKey: key,
    header: ({ column }) => {
      return h('div', {
        // variant: 'ghost',
        // onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        class: "w-full text-center text-gray-700",
      }, label)
    },
    cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue(key)),
  }
}
const columns = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        modelValue: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:modelValue": (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'employeeId',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        class: "w-full text-gray-700 text-center",
      }, () => ['Mã nhân viên', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => {
      const code = row.getValue('employeeId')
      return h('a', {
        href: `/${code}`,
        class: 'text-center text-blue-500 block underline hover:text-blue-700',
      }, code)
    }
  },
  createCell('fullName', 'Tên nhân viên'),
  createCell('email', 'Email'),
  createCell('phone', 'Số điện thoại'),
  createCell('department', 'Phòng ban'),
  createCell('position', 'Chức vụ'),
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return h('div', { class: 'relative' }, h(DataTableDropDown, {
        payment,
        onExpand: row.toggleExpanded,
        onDelete: () => handleDelete(payment.employeeId),
        onEdit: () => { router.push(`/${payment.employeeId}`) },
      }))
    },
  },
]

const handleDelete = async (employeeId) => {
  try {
    const inputs = {
      employeeIds: [employeeId]
    }
    await EmployeeAPI.delete(inputs)
    toast.success('Xóa nhân viên thông')
    table.resetRowSelection()
    emits('refresh-table')
  }
  catch (e) {
    toast.error(e.message)
  }
}
const sorting = ref([])
const columnFilters = ref([])
const columnVisibility = ref({})
const rowSelection = ref({})
const expanded = ref({})

const deleteAllStaff = async () => {
  try {
    const employeeIds = table.getSelectedRowModel().rows.map(row => row.getValue('employeeId'))
    const inputs = {
      employeeIds
    }
    await EmployeeAPI.delete(inputs)
    toast.success('Xóa nhân viên thành công')
    table.resetRowSelection()
    emits('refresh-table')
  }
  catch (e) {
    toast.error(e.message)
  }
}
const table = useVueTable({
  get data() { return props.data },
  columns,
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
})
</script>

<template>
  <Button v-if="table.getSelectedRowModel().rows.length > 0" type="button" variant="destructive"
    @click="deleteAllStaff">Xóa {{
      table.getSelectedRowModel().rows.length }} nhân viên</Button>
  <div class="rounded-sm border w-full overflow-hidden mt-3">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
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
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
            <TableRow v-if="row.getIsExpanded()">
              <TableCell :colspan="row.getAllCells().length">
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
</template>