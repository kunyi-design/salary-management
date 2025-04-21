<template>
  <section class="px-4">
    <div class="flex gap-2">
      <button type="button" @click="onUpdate"
        class="rounded bg-blue-500 text-white hover:bg-blue-500/90 py-1.5 px-3 text-sm font-semibold cursor-pointer">
        Cập nhật
      </button>
      <button type="button" @click="onDelete"
        class="rounded bg-red-500 text-white hover:bg-red-500/90 py-1.5 px-3 text-sm font-semibold cursor-pointer">
        Xóa
      </button>
    </div>
    <div class="space-y-6 mt-7 border border-gray-200 p-4 rounded-md">
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-3">
          <FormField v-slot="{ componentField }" name="employeeId" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Mã nhân viên</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Mã nhân viên" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="col-span-3">
          <FormField v-slot="{ componentField }" name="fullName" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Tên nhân viên</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Ngô Thị Thu Hiền" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="col-span-3">
          <FormField name="birthDate">
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger as-child>
                    <FormControl>
                      <Button variant="outline" :class="cn(
                        'w-full ps-3 text-start font-normal',
                        !value && 'text-muted-foreground',
                      )">
                        <span>{{ value ? df.format(toDate(value)) : "Chọn ngày sinh" }}</span>
                        <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                      </Button>
                      <input hidden>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar v-model="value" calendar-label="Date of birth" initial-focus
                      :min-value="new CalendarDate(1900, 1, 1)" :max-value="today(getLocalTimeZone())"
                      @update:model-value="(v) => {
                        if (v) {
                          const iso = toDate(v).toISOString()
                          setFieldValue('birthDate', iso)
                        }
                        else {
                          setFieldValue('birthDate', undefined)
                        }
                      }" />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="col-span-3">
          <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="hienntt@gmail.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="col-span-3">
          <FormField v-slot="{ componentField }" name="phone" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input type="text" placeholder="0915818189" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- </div> -->
        <!-- <div class="grid grid-cols-12 gap-5"> -->
        <div class="col-span-3">
          <FormField name="department">
            <FormItem>
              <FormLabel>Ban / Trung tâm</FormLabel>
              <FormControl>
                <Select v-model="departmentValue">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Chọn ban / phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in departments" :key="item.code" :value="item.code">
                        {{ item.label }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="col-span-3">
          <FormField name="position">
            <FormItem>
              <FormLabel>Vị trí công việc</FormLabel>
              <FormControl>
                <Select v-model="positionValue">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Chọn vị trí công việc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in positions" :key="item.code" :value="item.code">
                        {{ item.label }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="col-span-3">
          <FormField v-slot="{ componentField }" name="company">
            <FormItem>
              <FormLabel>Công ty</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" :value="'CÔNG TY CỔ PHẦN DEHA VIỆT NAM'" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- <div class="col-span-3">
          <FormField v-slot="{ componentField }" name="bankAccount" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Số tài khoản</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nhập số tài khoản" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div> -->
      </div>
    </div>

    <div class="mt-10 border border-gray-200 p-4 rounded-md">
      <Tabs v-model="currentTab" default-value="contract" class="w-full">
        <TabsList class="grid grid-cols-3 w-[480px]">
          <TabsTrigger value="contract" class="cursor-pointer">
            Hợp đồng
          </TabsTrigger>
          <TabsTrigger value="wage" class="cursor-pointer">
            Lương
          </TabsTrigger>
          <TabsTrigger value="insurance" class="cursor-pointer">
            Bảo hiểm
          </TabsTrigger>
        </TabsList>
        <div v-show="currentTab === 'contract'">
          <div class="flex justify-between items-center">
            <Label for="terms">Danh sách hợp đồng</Label>
            <button type="button" @click="addContracts"
              class="rounded bg-blue-500 text-white shadow-xs hover:bg-blue-500/90 py-1.5 px-3 text-sm font-semibold cursor-pointer">
              Thêm hợp đồng
            </button>
          </div>

          <div class="rounded-sm border mt-2">
            <Table>
              <TableHeader>
                <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                  <TableHead v-for="header in headerGroup.headers" :key="header.id">
                    <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                      :props="header.getContext()" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="table.getRowModel().rows?.length">
                  <template v-for="row in table.getRowModel().rows" :key="row.id">
                    <TableRow :data-state="row.getIsSelected() && 'selected'">
                      <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
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
        </div>
        <div v-show="currentTab === 'wage'" class="mt-2">
          <div class="space-y-6">
            <div class="grid grid-cols-12 gap-5">
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="basicSalary" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Lương cơ bản</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="responsibilityAllowance" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Phụ cấp trách nhiệm</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="gasolineAllowance" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Phụ cấp xăng xe</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="telephoneAllowance" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Phụ cấp điện thoại</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="lunchAllowance" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Phụ cấp ăn trưa</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="childSupportAllowance" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Phụ cấp nuôi con nhỏ</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="attendanceAllowance" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Phụ cấp chuyên cần</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="seniorityAllowance" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Phụ cấp thâm niên</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="totalIncome" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Tổng thu nhập</FormLabel>
                    <FormControl>
                      <Input type="text" class="bg-gray-100" placeholder="" disabled v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </div>
        </div>
        <div v-show="currentTab === 'insurance'" class="mt-2">
          <div class="space-y-6">
            <div class="grid grid-cols-12 gap-5">
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="salaryForInsurance" :validate-on-blur="!isFieldDirty">
                  <FormItem>
                    <FormLabel>Mức lương đóng BHXH</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-5">
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="bhxhCompany">
                  <FormItem>
                    <FormLabel>BHXH công ty đóng</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="bhytCompany">
                  <FormItem>
                    <FormLabel>BHYT công ty đóng</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="bhtnCompany">
                  <FormItem>
                    <FormLabel>BHTN công ty đóng</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="totalCompanyInsurance">
                  <FormItem>
                    <FormLabel>Tổng bảo hiểm công ty đóng</FormLabel>
                    <FormControl>
                      <Input type="text" class="bg-gray-100" v-bind="componentField" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <div class="grid grid-cols-12 gap-5">
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="bhxhEmployee">
                  <FormItem>
                    <FormLabel>BHXH NLĐ đóng</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="bhytEmployee">
                  <FormItem>
                    <FormLabel>BHYT NLĐ đóng</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="bhtnEmployee">
                  <FormItem>
                    <FormLabel>BHTN NLĐ đóng</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="col-span-3">
                <FormField v-slot="{ componentField }" name="totalEmployeeInsurance">
                  <FormItem>
                    <FormLabel>Tổng bảo hiểm NLĐ đóng</FormLabel>
                    <FormControl>
                      <Input type="text" class="bg-gray-100" v-bind="componentField" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>

          </div>
        </div>
      </Tabs>
    </div>

    <div class="my-10 border border-gray-200 p-4 rounded-md">
      <Label for="info" class="text-base">Thông tin cá nhân</Label>
      <div class="space-y-6 mt-5">
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-3">
            <FormField v-slot="{ componentField }" name="cmnd" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Số CMND</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nhập số CMND" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="col-span-3">
            <FormField name="dateOfIssue">
              <FormItem>
                <FormLabel>Ngày cấp</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger as-child>
                      <FormControl>
                        <Button variant="outline" :class="cn(
                          'w-full ps-3 text-start font-normal',
                          !dateOfIssueValue && 'text-muted-foreground',
                        )">
                          <span>{{ dateOfIssueValue ? df.format(toDate(dateOfIssueValue)) : "Chọn ngày cấp"
                          }}</span>
                          <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                        </Button>
                        <input hidden>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="dateOfIssueValue" calendar-label="Date of birth" initial-focus
                        :min-value="new CalendarDate(1900, 1, 1)" :max-value="today(getLocalTimeZone())"
                        @update:model-value="(v) => {
                          if (v) {
                            const iso = toDate(v).toISOString()
                            setFieldValue('dateOfIssue', iso)
                          }
                          else {
                            setFieldValue('dateOfIssue', undefined)
                          }
                        }" />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="col-span-3">
            <FormField v-slot="{ componentField }" name="placeOfIssue" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Nơi cấp</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nhập nơi cấp" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="col-span-3">
            <FormField v-slot="{ componentField }" name="bankAccount" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Số tài khoản</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nhập số tài khoản" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="col-span-3">
            <FormField v-slot="{ componentField }" name="accountName" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Tên tài khoản</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nhập tên tài khoản" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="col-span-3">
            <FormField name="bankName">
              <FormItem>
                <FormLabel>Ngân hàng</FormLabel>
                <FormControl>
                  <Select v-model="bankNameValue">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Chọn ngân hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in bankNames" :key="item.code" :value="item.code">
                          {{ item.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="col-span-3">
            <FormField v-slot="{ componentField }" name="taxCode" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Mã số thuế</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nhập mã số thuế" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="col-span-3">
            <FormField v-slot="{ componentField }" name="permanentAddress" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Địa chỉ thường trú</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nhập địa chỉ thường trú" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="col-span-3">
            <FormField v-slot="{ componentField }" name="temporaryAddress" :validate-on-blur="!isFieldDirty">
              <FormItem>
                <FormLabel>Địa chỉ tạm trú</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Nhập địa chỉ tạm trú" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed, h } from 'vue';
import { toast } from 'vue-sonner'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { toDate } from 'reka-ui/date'
import { toTypedSchema } from '@vee-validate/zod'
import EmployeeAPI from '@/services/api/EmployeeAPI';
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
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
import { valueUpdater } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today, fromDate } from '@internationalized/date'
import { CalendarIcon, XIcon } from 'lucide-vue-next'

const store = useStore()
const route = useRoute()
const router = useRouter()
const data = ref({})
const currentTab = ref('contract')
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const formSchema = toTypedSchema(
  z.object({
    fullName: z
      .string({ required_error: 'Vui lòng nhập tên nhân viên' })
      .min(2, { message: 'Tên nhân viên phải có ít nhất 2 ký tự' })
      .max(50, { message: 'Tên nhân viên không được quá 50 ký tự' }),
    birthDate: z
      .string({ required_error: 'Vui lòng chọn ngày sinh' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Ngày sinh không hợp lệ',
      }),
    dateOfIssue: z
      .string({ required_error: 'Vui lòng chọn ngày cấp' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Ngày cấp không hợp lệ',
      }),
    placeOfIssue: z
      .string({ required_error: 'Vui lòng nhập nơi cấp' })
      .min(2, { message: 'Nơi cấp phải có ít nhất 2 ký tự' })
      .max(50, { message: 'Nơi cấp không được quá 50 ký tự' }),
    email: z
      .string({ required_error: 'Vui lòng nhập email' })
      .email({ message: 'Email không hợp lệ' })
      .max(50, { message: 'Email không được quá 50 ký tự' }),
    phone: z
      .string({ required_error: 'Vui lòng nhập số điện thoại' })
      .min(10, { message: 'Số điện thoại phải có ít nhất 10 ký tự' })
      .max(11, { message: 'Số điện thoại không được quá 11 ký tự' })
      .regex(/^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/, { message: 'Số điện thoại không hợp lệ' }),
    cmnd: z
      .string({ required_error: 'Vui lòng nhập số CMND' })
      .min(9, { message: 'Số CMND phải có ít nhất 9 ký tự' })
      .max(12, { message: 'Số CMND không được quá 12 ký tự' }),
    company: z.string().default('CÔNG TY CỔ PHẦN DEHA VIỆT NAM'),
    department: z.string().default('phongnhansu'),
    position: z.string().default('giamdoc'),
    bankAccount: z
      .string({ required_error: 'Vui lòng nhập số tài khoản' })
      .min(10, { message: 'Số tài khoản phải có ít nhất 10 ký tự' })
      .max(20, { message: 'Số tài khoản không được quá 20 ký tự' }),
    accountName: z
      .string({ required_error: 'Vui lòng nhập tên tài khoản' })
      .min(2, { message: 'Tên tài khoản phải có ít nhất 2 ký tự' })
      .max(50, { message: 'Tên tài khoản không được quá 50 ký tự' }),
    bankName: z.string().default('vietcombank'),
    taxCode: z
      .string({ required_error: 'Vui lòng nhập mã số thuế' })
      .min(10, { message: 'Mã số thuế phải có ít nhất 10 ký tự' })
      .max(15, { message: 'Mã số thuế không được quá 15 ký tự' }),
    permanentAddress: z
      .string({ required_error: 'Vui lòng nhập địa chỉ thường trú' })
      .min(5, { message: 'Địa chỉ thường trú phải có ít nhất 5 ký tự' })
      .max(100, { message: 'Địa chỉ thường trú không được quá 100 ký tự' }),
    temporaryAddress: z
      .string({ required_error: 'Vui lòng nhập địa chỉ tạm trú' })
      .min(5, { message: 'Địa chỉ tạm trú phải có ít nhất 5 ký tự' })
      .max(100, { message: 'Địa chỉ tạm trú không được quá 100 ký tự' }),
    basicSalary: z.any(),
    responsibilityAllowance: z.any(),
    gasolineAllowance: z.any(),
    telephoneAllowance: z.any(),
    lunchAllowance: z.any(),
    childSupportAllowance: z.any(),
    attendanceAllowance: z.any(),
    seniorityAllowance: z.any(),
    salaryForInsurance: z.any(),
    bhxhCompany: z.any(),
    bhytCompany: z.any(),
    bhtnCompany: z.any(),
    bhxhEmployee: z.any(),
    bhytEmployee: z.any(),
    bhtnEmployee: z.any()
  })
)

const { isFieldDirty, handleSubmit, values, setFieldValue, resetForm } = useForm({
  validationSchema: formSchema,
})
const departments = ref([
  { id: 1, label: 'Phòng nhân sự', code: 'Phòng nhân sự' },
  { id: 2, label: 'Phòng kế toán', code: 'Phòng kế toán' },
  { id: 3, label: 'Phòng marketing', code: 'Phòng marketing' },
  { id: 4, label: 'Phòng kỹ thuật', code: 'Phòng kỹ thuật' },
  { id: 5, label: 'Phòng chăm sóc khách hàng', code: 'Phòng chăm sóc khách hàng' },
])
const positions = ref([
  { id: 1, label: 'Giám đốc', code: 'Giám đốc' },
  { id: 2, label: 'Phó giám đốc', code: 'Phó giám đốc' },
  { id: 3, label: 'Trưởng phòng', code: 'Trưởng phòng' },
  { id: 4, label: 'Nhân viên', code: 'Nhân viên' },
  { id: 5, label: 'Thực tập sinh', code: 'Thực tập sinh' },
])

const bankNames = ref([
  { id: 1, label: 'Ngân hàng Vietcombank', code: 'Ngân hàng Vietcombank' },
  { id: 2, label: 'Ngân hàng BIDV', code: 'Ngân hàng BIDV' },
  { id: 3, label: 'Ngân hàng Techcombank', code: 'Ngân hàng Techcombank' },
  { id: 4, label: 'Ngân hàng Agribank', code: 'Ngân hàng Agribank' },
  { id: 5, label: 'Ngân hàng ACB', code: 'Ngân hàng ACB' },
])
const value = computed(() => {
  if (!values.birthDate) return undefined
  const d = new Date(values.birthDate)
  return isNaN(d.getTime()) ? undefined : fromDate(d)
})

const dateOfIssueValue = computed(() => {
  if (!values.dateOfIssue) return undefined
  const d = new Date(values.dateOfIssue)
  return isNaN(d.getTime()) ? undefined : fromDate(d)
})

const departmentValue = computed({
  get: () => values.department,
  set: val => setFieldValue('department', val),
})
const positionValue = computed({
  get: () => values.position,
  set: val => setFieldValue('position', val),
})
const bankNameValue = computed({
  get: () => values.bankName,
  set: val => setFieldValue('bankName', val),
})

const getStaff = async () => {
  try {
    const code = route.params.code
    const { insurance, employee, salary, contracts } = await EmployeeAPI.get(null, code)
    dataTable.value = contracts
    data.value = employee

    setFieldValue('employeeId', data.value.employeeId)
    setFieldValue('fullName', data.value.fullName)
    setFieldValue('birthDate', data.value.birthDate)
    setFieldValue('email', data.value.email)
    setFieldValue('phone', data.value.phone)
    setFieldValue('cmnd', data.value.personalInfo?.idCard?.number || '')
    setFieldValue('dateOfIssue', data.value.personalInfo?.idCard?.issueDate || '')
    setFieldValue('placeOfIssue', data.value.personalInfo?.idCard?.issuePlace || '')
    setFieldValue('department', data.value.department)
    setFieldValue('position', data.value.position)
    setFieldValue('accountName', data.value.personalInfo.bankAccount.accountName)
    setFieldValue('bankName', data.value.personalInfo.bankAccount.bankName)
    setFieldValue('bankAccount', data.value.personalInfo.bankAccount.accountNumber)

    setFieldValue('basicSalary', salary.basicSalary)
    setFieldValue('responsibilityAllowance', salary.responsibilityAllowance)
    setFieldValue('gasolineAllowance', salary.transportAllowance)
    setFieldValue('telephoneAllowance', salary.phoneAllowance)
    setFieldValue('lunchAllowance', salary.lunchAllowance)
    setFieldValue('childSupportAllowance', salary.childrenAllowance)
    setFieldValue('attendanceAllowance', salary.attendanceAllowance)
    setFieldValue('seniorityAllowance', salary.seniorityAllowance)
    setFieldValue('totalIncome', salary ? salary.totalSalaryGross : 0)

    setFieldValue('taxCode', data.value.personalInfo.taxCode)
    setFieldValue('permanentAddress', data.value.personalInfo.permanentAddress)
    setFieldValue('temporaryAddress', data.value.personalInfo.temporaryAddress)

    setFieldValue('salaryForInsurance', insurance.salaryForInsurance)
    setFieldValue('bhxhCompany', insurance.companyInsurance.rate.socialInsurance)
    setFieldValue('bhytCompany', insurance.companyInsurance.rate.healthInsurance)
    setFieldValue('bhtnCompany', insurance.companyInsurance.rate.unemploymentInsurance)
    setFieldValue('totalCompanyInsurance', insurance.companyInsurance.rate.socialInsurance + insurance.companyInsurance.rate.healthInsurance + insurance.companyInsurance.rate.unemploymentInsurance)

    setFieldValue('bhxhEmployee', insurance.employeeInsurance.rate.socialInsurance)
    setFieldValue('bhytEmployee', insurance.employeeInsurance.rate.healthInsurance)
    setFieldValue('bhtnEmployee', insurance.employeeInsurance.rate.unemploymentInsurance)
    setFieldValue('totalEmployeeInsurance', insurance.employeeInsurance.rate.socialInsurance + insurance.employeeInsurance.rate.healthInsurance + insurance.employeeInsurance.rate.unemploymentInsurance)
  }
  catch (e) {
    toast.error(e.message)
  }
}

//------------table-----------
const dataTable = ref([])
const sorting = ref([])
const columnFilters = ref([])
const columnVisibility = ref({})
const rowSelection = ref({})
const expanded = ref({})

const createRowDatePicker = (key, title) => ({
  accessorKey: key,
  header: () => h('div', { class: 'text-center text-sm font-semibold text-gray-700' }, title),
  cell: ({ row }) => {
    const index = row.index
    const currentValue = dataTable.value[index][key]
    const parsedDate = currentValue ? parseDate(currentValue.split('T')[0]) : undefined
    return h(Popover, {

    }, {
      default: () => [
        h(PopoverTrigger, { class: 'w-full' }, {
          default: () => [
            h(Button, {
              variant: 'outline',
              class: cn(
                'w-full ps-3 text-start font-normal',
                !parsedDate && 'text-muted-foreground'
              )
            }, {
              default: () => [
                h('span', {}, parsedDate ? df.format(toDate(parsedDate)) : 'Chọn ngày'),
                h(CalendarIcon, { class: 'ms-auto h-4 w-4 opacity-50' })
              ]
            })
          ]
        }),
        h(PopoverContent, { class: 'w-auto p-0' }, {
          default: () => h(Calendar, {
            modelValue: parsedDate,
            'onUpdate:modelValue': (v) => {
              dataTable.value[index][key] = v?.toString()
            },
            'min-value': new CalendarDate(1900, 1, 1),
            'max-value': today(getLocalTimeZone()),
            'calendar-label': 'From Date',
            'initial-focus': true
          })
        })
      ]
    })
  }
})
const columns = [
  {
    id: 'stt',
    header: () => h('div', { class: 'text-center text-sm font-semibold text-gray-700' }, 'STT'),
    cell: ({ row }) => h('div', { class: 'text-center' }, row.index + 1),
  },
  {
    accessorKey: 'contractType',
    header: () => h('div', { class: 'text-center text-sm font-semibold text-gray-700' }, 'Loại hợp đồng'),
    cell: ({ row }) => {
      const index = row.index
      const currentValue = dataTable.value[index]?.contractType

      return h(Select, {
        modelValue: currentValue,
        'onUpdate:modelValue': (newValue) => {
          dataTable.value[index].contractType = newValue
        }
      }, {
        default: () => [
          h(SelectTrigger, { class: 'w-full' }, {
            default: () => h(SelectValue, { placeholder: 'Chọn loại hợp đồng' })
          }),
          h(SelectContent, {}, {
            default: () => [
              h(SelectItem, { value: 'Hợp đồng thử việc' }, { default: () => 'Hợp đồng thử việc' }),
              h(SelectItem, { value: 'Hợp đồng chính thức' }, { default: () => 'Hợp đồng chính thức' }),
            ]
          })
        ]
      })
    }
  },
  {
    accessorKey: 'contractId',
    header: () => h('div', { class: 'text-center text-sm font-semibold text-gray-700' }, 'Mã hợp đồng'),
    cell: ({ row }) => {
      return h(Input, {
        modelValue: row.getValue('contractId'),
        disabled: true,
        class: 'bg-gray-100'
      })
    }
  },
  createRowDatePicker('fromDate', 'Từ ngày'),
  createRowDatePicker('toDate', 'Đến ngày'),
  {
    id: 'actions',
    cell: ({ row }) => h(Button, { variant: 'primary', onClick: () => dataTable.value = dataTable.value.filter((_, i) => i !== row.index) }, {
      default: () => [
        h(XIcon)
      ]
    })
  }
]
const table = useVueTable({
  data: dataTable,
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

const addContracts = () => {
  dataTable.value = [...dataTable.value, { contractType: '', fromDate: '', toDate: '' }];
}
const onUpdate = handleSubmit(async (values) => {
  try {
    const validContracts = dataTable.value.filter(item => {
      return item.contractType && item.fromDate && item.toDate
    })

    const inputs = {
      fullName: values.fullName,
      birthDate: values.birthDate,
      email: values.email,
      phone: values.phone,
      department: values.department,
      position: values.position,
      personalInfo: {
        idCard: {
          number: values.cmnd,
          issueDate: values.dateOfIssue,
          issuePlace: values.placeOfIssue
        },
        bankAccount: {
          accountNumber: values.bankAccount,
          accountName: values.accountName,
          bankName: values.bankName
        },
        taxCode: values.taxCode,
        permanentAddress: values.permanentAddress,
        temporaryAddress: values.temporaryAddress
      },
      contract: validContracts.length > 0 ? validContracts : [],
      insurance: {
        salaryForInsurance: parseInt(values.salaryForInsurance),
        companyInsurance: {
          rate: {
            socialInsurance: parseInt(values.bhxhCompany),
            healthInsurance: parseInt(values.bhytCompany),
            unemploymentInsurance: parseInt(values.bhtnCompany),
          }
        },
        employeeInsurance: {
          rate: {
            socialInsurance: parseInt(values.bhxhEmployee),
            healthInsurance: parseInt(values.bhytEmployee),
            unemploymentInsurance: parseInt(values.bhtnEmployee),
          }
        }
      },
      salary: {
        basicSalary: parseInt(values.basicSalary),
        responsibilityAllowance: parseInt(values.responsibilityAllowance),
        transportAllowance: parseInt(values.gasolineAllowance),
        phoneAllowance: parseInt(values.telephoneAllowance),
        lunchAllowance: parseInt(values.lunchAllowance),
        childrenAllowance: parseInt(values.childSupportAllowance),
        attendanceAllowance: parseInt(values.attendanceAllowance),
        seniorityAllowance: parseInt(values.seniorityAllowance),
      }
    }

    const res = await EmployeeAPI.put('/' + route.params.code, inputs)
    setFieldValue('totalIncome', res.salary?.totalSalaryGross || 0)
    setFieldValue('totalCompanyInsurance', res.insurance.companyInsurance.rate.socialInsurance + res.insurance.companyInsurance.rate.healthInsurance + res.insurance.companyInsurance.rate.unemploymentInsurance)
    setFieldValue('totalEmployeeInsurance', res.insurance.employeeInsurance.rate.socialInsurance + res.insurance.employeeInsurance.rate.healthInsurance + res.insurance.employeeInsurance.rate.unemploymentInsurance)
    dataTable.value = res.contracts
    toast.success("Cập nhật nhân viên thành công")
  }
  catch (e) {
    toast.error(e.message)
  }
})

const onDelete = async () => {
  try {
    const inputs = {
      employeeIds: [route.params.code]
    }
    await EmployeeAPI.delete(inputs)
    router.push('/')
    toast.success('Xóa nhân viên thành công')
  }
  catch (e) {
    toast.error(e.message)
  }
}
onMounted(() => {
  getStaff()
  store.dispatch('app/setBreadcrumb', {
    parentTitle: 'Nhân viên',
    currentTitle: route.params.code,
  })
})
</script>