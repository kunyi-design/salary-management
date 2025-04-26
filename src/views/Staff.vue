<template>
  <section class="px-4 grid">
    <Accordion type="single" class="w-full border mb-16 px-5 rounded-sm" collapsible v-model="defaultValue">
      <AccordionItem :key="'addStaff'" :value="'addStaff'">
        <AccordionTrigger class=" cursor-pointer text-blue-500 hover:no-underline">Thêm nhân viên</AccordionTrigger>
        <AccordionContent>
          <div class="">
            <form class="space-y-6" @submit.prevent="onSubmit">
              <div class="grid grid-cols-12 gap-5">
                <div class="col-span-3">
                  <FormField v-slot="{ componentField }" name="fullName" :validate-on-blur="!isFieldDirty">
                    <FormItem>
                      <FormLabel>Tên nhân viên</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Nhập tên nhân viên" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div class="col-span-3">
                  <FormField name="dateOfBirth">
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger as-child>
                            <FormControl>
                              <Button variant="outline" :class="cn(
                                'w-full ps-3 text-start font-normal',
                                !placeholderDateOfBirth && 'text-muted-foreground',
                              )">
                                <span>{{ placeholderDateOfBirth ? df.format(toDate(placeholderDateOfBirth)) : `Chọn ngày
                                  sinh` }}</span>
                                <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                              </Button>
                              <input hidden>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent class="w-auto p-0">
                            <!-- <Calendar v-model="value" calendar-label="Date of birth" initial-focus
                              :min-value="new CalendarDate(1900, 1, 1)" :max-value="new CalendarDate(2025, 12, 31)"
                              @update:model-value="(v) => {
                                console.log(v)
                                if (v) {
                                  setFieldValue('dateOfBirth', v.toString())
                                }
                                else {
                                  setFieldValue('dateOfBirth', undefined)
                                }
                              }" /> -->
                            <CalendarRoot v-slot="{ date, grid, weekDays }" v-model:placeholder="placeholderDateOfBirth"
                              v-bind="forwarded" :class="cn('rounded-md border p-3', props.class)">
                              <CalendarHeader>
                                <CalendarHeading class="flex w-full items-center justify-between gap-2">
                                  <Select :default-value="placeholderDateOfBirth.month.toString()" @update:model-value="(v) => {
                                    if (!v || !placeholderDateOfBirth) return;
                                    if (Number(v) === placeholderDateOfBirth?.month) return;
                                    placeholderDateOfBirth = placeholderDateOfBirth.set({
                                      month: Number(v),
                                    })
                                  }">
                                    <SelectTrigger aria-label="Select month" class="w-[60%]">
                                      <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent class="max-h-[200px]">
                                      <SelectItem v-for="month in createYear({ dateObj: date })" :key="month.toString()"
                                        :value="month.month.toString()">
                                        {{ formatter.custom(toDate(month), { month: 'long' }) }}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>

                                  <Select :default-value="placeholderDateOfBirth.year.toString()" @update:model-value="(v) => {
                                    if (!v || !placeholderDateOfBirth) return;
                                    if (Number(v) === placeholderDateOfBirth?.year) return;
                                    placeholderDateOfBirth = placeholderDateOfBirth.set({
                                      year: Number(v),
                                    })
                                  }">
                                    <SelectTrigger aria-label="Select year" class="w-[40%]">
                                      <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent class="max-h-[200px]">
                                      <SelectItem
                                        v-for="yearValue in createDecade({ dateObj: date, startIndex: -50, endIndex: 50 })"
                                        :key="yearValue.toString()" :value="yearValue.year.toString()">
                                        {{ yearValue.year }}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </CalendarHeading>
                              </CalendarHeader>

                              <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
                                <CalendarGrid v-for="month in grid" :key="month.value.toString()">
                                  <CalendarGridHead>
                                    <CalendarGridRow>
                                      <CalendarHeadCell v-for="day in weekDays" :key="day">
                                        {{ day }}
                                      </CalendarHeadCell>
                                    </CalendarGridRow>
                                  </CalendarGridHead>
                                  <CalendarGridBody class="grid">
                                    <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`"
                                      class="mt-2 w-full">
                                      <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()"
                                        :date="weekDate">
                                        <CalendarCellTrigger :day="weekDate" :month="month.value" @click="() => {
                                          const date = weekDate.toDate();
                                          setFieldValue('dateOfBirth', df.format(new Date(date.toISOString())));
                                          placeholderDateOfBirth = weekDate;
                                        }" />
                                      </CalendarCell>
                                    </CalendarGridRow>
                                  </CalendarGridBody>
                                </CalendarGrid>
                              </div>
                            </CalendarRoot>
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
                        <Input type="text" placeholder="Nhập email" v-bind="componentField" />
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
                        <Input type="text" placeholder="Nhập số điện thoại" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
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
                                !placeholderDateOfIssue && 'text-muted-foreground',
                              )">
                                <span>{{ placeholderDateOfIssue ? df.format(toDate(placeholderDateOfIssue)) : `Chọn ngày
                                  cấp` }}</span>
                                <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                              </Button>
                              <input hidden>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent class="w-auto p-0">
                            <CalendarRoot v-slot="{ date, grid, weekDays }" v-model:placeholder="placeholderDateOfIssue"
                              v-bind="forwarded" :class="cn('rounded-md border p-3', props.class)">
                              <CalendarHeader>
                                <CalendarHeading class="flex w-full items-center justify-between gap-2">
                                  <Select :default-value="placeholderDateOfIssue.month.toString()" @update:model-value="(v) => {
                                    if (!v || !placeholderDateOfIssue) return;
                                    if (Number(v) === placeholderDateOfIssue?.month) return;
                                    placeholderDateOfIssue = placeholderDateOfIssue.set({
                                      month: Number(v),
                                    })
                                  }">
                                    <SelectTrigger aria-label="Select month" class="w-[60%]">
                                      <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent class="max-h-[200px]">
                                      <SelectItem v-for="month in createYear({ dateObj: date })" :key="month.toString()"
                                        :value="month.month.toString()">
                                        {{ formatter.custom(toDate(month), { month: 'long' }) }}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>

                                  <Select :default-value="placeholderDateOfIssue.year.toString()" @update:model-value="(v) => {
                                    if (!v || !placeholderDateOfIssue) return;
                                    if (Number(v) === placeholderDateOfIssue?.year) return;
                                    placeholderDateOfIssue = placeholderDateOfIssue.set({
                                      year: Number(v),
                                    })
                                  }">
                                    <SelectTrigger aria-label="Select year" class="w-[40%]">
                                      <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent class="max-h-[200px]">
                                      <SelectItem
                                        v-for="yearValue in createDecade({ dateObj: date, startIndex: -50, endIndex: 50 })"
                                        :key="yearValue.toString()" :value="yearValue.year.toString()">
                                        {{ yearValue.year }}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </CalendarHeading>
                              </CalendarHeader>

                              <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
                                <CalendarGrid v-for="month in grid" :key="month.value.toString()">
                                  <CalendarGridHead>
                                    <CalendarGridRow>
                                      <CalendarHeadCell v-for="day in weekDays" :key="day">
                                        {{ day }}
                                      </CalendarHeadCell>
                                    </CalendarGridRow>
                                  </CalendarGridHead>
                                  <CalendarGridBody class="grid">
                                    <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`"
                                      class="mt-2 w-full">
                                      <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()"
                                        :date="weekDate">
                                        <CalendarCellTrigger :day="weekDate" :month="month.value" @click="() => {
                                          const date = weekDate.toDate();
                                          setFieldValue('dateOfIssue', df.format(new Date(date.toISOString())));
                                          placeholderDateOfIssue = weekDate;
                                        }" />
                                      </CalendarCell>
                                    </CalendarGridRow>
                                  </CalendarGridBody>
                                </CalendarGrid>
                              </div>
                            </CalendarRoot>
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
              </div>
              <div class="grid grid-cols-12 gap-5">
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
                    <FormItem class="w-full flex gap-2 flex-col">
                      <FormLabel>Vị trí công việc</FormLabel>
                      <FormControl>
                        <Select v-model="positionValue">
                          <SelectTrigger class="w-full">
                            <SelectValue placeholder="Chọn vị trí công việc" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem v-for="item in filteredPositions" :key="item.id" :value="item.code">
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
                <div class="col-span-6">
                  <FormField name="company">
                    <FormItem class="w-full flex gap-2 flex-col">
                      <FormLabel>Chi nhánh</FormLabel>
                      <FormControl>
                        <Select v-model="branchValue">
                          <SelectTrigger class="w-full">
                            <SelectValue placeholder="Chọn chi nhánh" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem v-for="item in branchs" :key="item.id" :value="item.code">
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
              <div class="flex justify-end gap-3">
                <Button @click="defaultValue = undefined" type="button" variant="outline">
                  Hủy bỏ
                </Button>
                <template v-if="isLoadingSubmit">
                  <Button disabled variant="primary">
                    <Loader2 class="w-4 h-4 animate-spin" />
                  </Button>
                </template>
                <template v-else>
                  <Button type="submit" variant="primary">
                    Tạo mới
                  </Button>
                </template>
              </div>
            </form>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <TableListEmployee :isLoading="isLoading" :data="dataEmployee" @refresh-table="getEmployees" />
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import TableListEmployee from '@/components/Staff/TableListEmployee.vue';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Calendar, CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { toast } from '@/components/ui/toast/use-toast'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useStore } from 'vuex';
import { toDate, createDecade, createYear } from 'reka-ui/date'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { h } from 'vue'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { CalendarIcon, Loader2 } from 'lucide-vue-next'
import EmployeeAPI from '@/services/api/EmployeeAPI';
import { toast } from 'vue-sonner'
import { useVModel } from '@vueuse/core'
import { CalendarRoot, useDateFormatter, useForwardPropsEmits } from 'reka-ui'

const store = useStore()
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const isLoadingSubmit = ref(false)
const isLoading = ref(false)

const defaultValue = ref('')
const dataEmployee = ref([])
const departments = ref([
  { id: 1, label: 'BOM - Ban điều hành', code: 'BOM - Ban điều hành' },
  { id: 2, label: 'ATC - Phòng Admin, Tài chính', code: 'ATC - Phòng Admin, Tài chính' },
  { id: 3, label: 'HR- Phòng Đào tạo , Nhân sự', code: 'HR- Phòng Đào tạo , Nhân sự' },
  { id: 4, label: 'BPPT - Bộ phận Phát triển Thị trường', code: 'BPPT - Bộ phận Phát triển Thị trường' },
  { id: 5, label: 'ITS - Phòng IT Server', code: 'ITS - Phòng IT Server' },
  { id: 6, label: 'QA - Phòng Quản lý Quy trình', code: 'QA - Phòng Quản lý Quy trình' },
])
const positions = ref([
  { id: 1, label: 'TP ĐH - Trưởng phòng Điều Hành', code: 'TP ĐH - Trưởng phòng Điều Hành', parentId: 'BOM - Ban điều hành' },
  { id: 2, label: 'NV ĐH - Nhân viên Điều Hành', code: 'NV ĐH - Nhân viên Điều Hành', parentId: 'BOM - Ban điều hành' },
  { id: 3, label: 'KTT - Kế toán trưởng', code: 'KTT - Kế toán trưởng', parentId: 'ATC - Phòng Admin, Tài chính' },
  { id: 4, label: 'NV KT - Nhân viên Kế Toán', code: 'NV KT - Nhân viên Kế Toán', parentId: 'ATC - Phòng Admin, Tài chính' },
  { id: 5, label: 'TP NS - Trưởng phòng Nhân Sự', code: 'TP NS - Trưởng phòng Nhân Sự', parentId: 'HR- Phòng Đào tạo , Nhân sự' },
  { id: 6, label: 'NV NS - Nhân viên Nhân Sự', code: 'NV NS - Nhân viên Nhân Sự', parentId: 'HR- Phòng Đào tạo , Nhân sự' },
  { id: 7, label: 'TP PT - Trưởng phòng Phát Triển Thị Trường', code: 'TP PT - Trưởng phòng Phát Triển Thị Trường', parentId: 'BPPT - Bộ phận Phát triển Thị trường' },

  { id: 8, label: 'PO - Quản lý chất lượng sản phẩm', code: 'PO - Quản lý chất lượng sản phẩm', parentId: 'BPPT - Bộ phận Phát triển Thị trường' },
  { id: 9, label: 'PM - Quản lý dự án', code: 'PM - Quản lý dự án', parentId: 'BPPT - Bộ phận Phát triển Thị trường' },
  { id: 10, label: 'BA - Nhân viên nghiệp vụ', code: 'BA - Nhân viên nghiệp vụ', parentId: 'BPPT - Bộ phận Phát triển Thị trường' },
  { id: 11, label: 'DEV - Nhân viên lập trình', code: 'DEV - Nhân viên lập trình', parentId: 'BPPT - Bộ phận Phát triển Thị trường' },
  { id: 12, label: 'TESTER - Nhân viên kiểm thử', code: 'TESTER - Nhân viên kiểm thử', parentId: 'BPPT - Bộ phận Phát triển Thị trường' },

  { id: 13, label: 'TP ITS - Trưởng phòng IT Server', code: 'TP ITS - Trưởng phòng IT Server', parentId: 'ITS - Phòng IT Server' },
  { id: 14, label: 'NV ITS - Nhân viên IT Server', code: 'NV ITS - Nhân viên IT Server', parentId: 'ITS - Phòng IT Server' },
  { id: 15, label: 'TP QA - Trưởng phòng Quản Lý Quy Trình', code: 'TP QA - Trưởng phòng Quản Lý Quy Trình', parentId: 'QA - Phòng Quản lý Quy trình' },
  { id: 16, label: 'NV QA - Nhân viên Quản Lý Quy Trình', code: 'NV QA - Nhân viên Quản Lý Quy Trình', parentId: 'QA - Phòng Quản lý Quy trình' },
])
const branchs = ref([
  { id: 1, label: 'HN - Trụ sở chính', code: 'HN - Trụ sở chính' },
  { id: 1, label: 'HUE - Văn phòng đại diện Huế', code: 'HUE - Văn phòng đại diện Huế' },
  { id: 1, label: 'TPHCM - Văn phòng đại diện TPHCM', code: 'TPHCM - Văn phòng đại diện TPHCM' },
  { id: 1, label: 'JAPAN - Văn phòng đại diện Nhật Bản', code: 'JAPAN - Văn phòng đại diện Nhật Bản' },
])
const bankNames = ref([
  { id: 1, label: 'Ngân hàng Vietcombank', code: 'Ngân hàng Vietcombank' },
  { id: 2, label: 'Ngân hàng BIDV', code: 'Ngân hàng BIDV' },
  { id: 3, label: 'Ngân hàng Techcombank', code: 'Ngân hàng Techcombank' },
  { id: 4, label: 'Ngân hàng Agribank', code: 'Ngân hàng Agribank' },
  { id: 5, label: 'Ngân hàng ACB', code: 'Ngân hàng ACB' },
])
const props = withDefaults(defineProps(), {
  modelValue: undefined,
  placeholderDateOfBirth() {
    return today(getLocalTimeZone());
  },
  placeholderDateOfIssue() {
    return today(getLocalTimeZone());
  },
  weekdayFormat: 'short',
});

const emits = defineEmits();

const delegatedProps = computed(() => {
  const { class: _, placeholder: __, ...delegated } = props;
  return delegated;
});

const placeholderDateOfBirth = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: today(getLocalTimeZone()),
});

const placeholderDateOfIssue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: today(getLocalTimeZone()),
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const formatter = useDateFormatter('en');
const formSchema = toTypedSchema(
  z.object({
    fullName: z
      .string({ required_error: 'Vui lòng nhập tên nhân viên' })
      .min(2, { message: 'Tên nhân viên phải có ít nhất 2 ký tự' })
      .max(50, { message: 'Tên nhân viên không được quá 50 ký tự' }),
    dateOfBirth: z
      .string({ required_error: 'Vui lòng chọn ngày sinh' }),
    dateOfIssue: z
      .string({ required_error: 'Vui lòng chọn ngày cấp' }),
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
    company: z
      .string()
      .refine((val) => !!val, { message: 'Vui lòng chọn công ty' }),
    department: z
      .union([z.string(), z.number()])
      .refine((val) => !!val, {
        message: 'Vui lòng chọn phòng ban',
      }),
    position: z
      .union([z.string(), z.number()])
      .refine((val) => !!val, {
        message: 'Vui lòng chọn vị trí công việc',
      }),
    bankAccount: z
      .string({ required_error: 'Vui lòng nhập số tài khoản' })
      .min(10, { message: 'Số tài khoản phải có ít nhất 10 ký tự' })
      .max(20, { message: 'Số tài khoản không được quá 20 ký tự' }),
    accountName: z
      .string({ required_error: 'Vui lòng nhập tên tài khoản' })
      .min(2, { message: 'Tên tài khoản phải có ít nhất 2 ký tự' })
      .max(50, { message: 'Tên tài khoản không được quá 50 ký tự' }),
    bankName: z.string().refine((val) => !!val, { message: 'Vui lòng chọn ngân hàng' }),
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
  })
)

const { isFieldDirty, handleSubmit, values, setFieldValue, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    dateOfBirth: today(getLocalTimeZone()).toString(),
    dateOfIssue: today(getLocalTimeZone()).toString(),
    department: '',
    position: '',
    bankName: ''
  }
})


// const value = computed({
//   get: () => values.dateOfBirth ? parseDate(values.dateOfBirth) : undefined,
//   set: val => val,
// });
// const dateOfIssueValue = computed({
//   get: () => values.dateOfIssue ? parseDate(values.dateOfIssue) : undefined,
//   set: val => val,
// })
const departmentValue = computed({
  get: () => values.department,
  set: val => {
    const found = departments.value.find(d => d.code === val)
    setFieldValue('department', found?.code || null)
    setFieldValue('position', '')
  }
})
const positionValue = computed({
  get: () => values.position,
  set: val => setFieldValue('position', val),
})

const branchValue = computed({
  get: () => values.company,
  set: val => setFieldValue('company', val),
})
const bankNameValue = computed({
  get: () => values.bankName,
  set: val => setFieldValue('bankName', val),
})
const filteredPositions = computed(() => {
  if (!values.department) return []
  return positions.value.filter(pos => pos.parentId === values.department)
})

const getEmployees = async () => {
  isLoading.value = true
  try {
    const res = await EmployeeAPI.get('')
    dataEmployee.value = res.data
  }
  catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const onSubmit = handleSubmit(async (values) => {
  isLoadingSubmit.value = true
  try {
    const inputs = {
      fullName: values.fullName,
      birthDate: values.dateOfBirth,
      email: values.email,
      phone: values.phone,
      department: values.department,
      position: values.position,
      company: values.company,
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
      }
    }
    await EmployeeAPI.post('', inputs)
    toast.success("Thêm nhân viên thành công")
    resetForm()
    getEmployees()
  }
  catch (err) {
    toast.error(err.message)
  } finally {
    isLoadingSubmit.value = false
  }
})

onMounted(() => {
  getEmployees()
  store.dispatch('app/setBreadcrumb', {
    parentTitle: 'Sơ đồ tổ chức',
    currentTitle: 'Nhân viên',
  })
})
</script>