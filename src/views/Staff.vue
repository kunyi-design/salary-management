<template>
  <section class="px-4">
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
                        <Input type="text" placeholder="Ngô Thị Thu Hiền" v-bind="componentField" />
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
                                  setFieldValue('dateOfBirth', v.toString())
                                }
                                else {
                                  setFieldValue('dateOfBirth', undefined)
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
                                  setFieldValue('dateOfIssue', v.toString())
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
                <div class="col-span-6">
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
                <Button type="submit" variant="primary">
                  Tạo mới
                </Button>
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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { toast } from '@/components/ui/toast/use-toast'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useStore } from 'vuex';
import { toDate } from 'reka-ui/date'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { h } from 'vue'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-vue-next'
import EmployeeAPI from '@/services/api/EmployeeAPI';
import { toast } from 'vue-sonner'

const store = useStore()
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const isLoading = ref(false)

const defaultValue = ref('')
const dataEmployee = ref([])
const departments = ref([
  { id: 1, label: 'Phòng nhân sự', code: 'Phòng nhân sự' },
  { id: 2, label: 'Phòng kế toán', code: 'Phòng kế toán' },
  { id: 3, label: 'Phòng marketing', code: 'Phòng marketing' },
  { id: 4, label: 'Phòng kỹ thuật', code: 'Phòng kỹ thuật' },
  { id: 5, label: 'Phòng chăm sóc khách hàng', code: 'Phòng chăm sóc khách hàng' },
])
const positions = ref([
  { id: 1, label: 'TBP - Trưởng bộ phận thành', code: 'TBP - Trưởng bộ phận thành' },
  { id: 2, label: 'TPHCNS - Trưởng phòng HCNS', code: 'TPHCNS - Trưởng phòng HCNS' },
])

const bankNames = ref([
  { id: 1, label: 'Ngân hàng Vietcombank', code: 'Ngân hàng Vietcombank' },
  { id: 2, label: 'Ngân hàng BIDV', code: 'Ngân hàng BIDV' },
  { id: 3, label: 'Ngân hàng Techcombank', code: 'Ngân hàng Techcombank' },
  { id: 4, label: 'Ngân hàng Agribank', code: 'Ngân hàng Agribank' },
  { id: 5, label: 'Ngân hàng ACB', code: 'Ngân hàng ACB' },
])

const formSchema = toTypedSchema(
  z.object({
    fullName: z
      .string({ required_error: 'Vui lòng nhập tên nhân viên' })
      .min(2, { message: 'Tên nhân viên phải có ít nhất 2 ký tự' })
      .max(50, { message: 'Tên nhân viên không được quá 50 ký tự' }),
    dateOfBirth: z
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
  })
)

const { isFieldDirty, handleSubmit, values, setFieldValue, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    dateOfBirth: '',
    dateOfIssue: '',
    department: '',
    position: '',
    bankName: ''
  }
})
const value = computed({
  get: () => values.dateOfBirth ? parseDate(values.dateOfBirth) : undefined,
  set: val => val,
})
const dateOfIssueValue = computed({
  get: () => values.dateOfIssue ? parseDate(values.dateOfIssue) : undefined,
  set: val => val,
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
  try {
    const inputs = {
      fullName: values.fullName,
      birthDate: values.dateOfBirth,
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
      }
    }

    await EmployeeAPI.post('', inputs)
    toast.success("Thêm nhân viên thành công")
    resetForm()
    getEmployees()
  }
  catch (err) {
    toast.error(err.message)
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