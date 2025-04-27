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
                        !placeholder && 'text-muted-foreground',
                      )">
                        <span>{{ placeholder ? df.format(toDate(placeholder)) : "Chọn ngày sinh" }}</span>
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
                    <CalendarRoot v-slot="{ date, grid, weekDays }" v-model:placeholder="placeholder" v-bind="forwarded"
                      :class="cn('rounded-md border p-3', props.class)">
                      <CalendarHeader>
                        <CalendarHeading class="flex w-full items-center justify-between gap-2">
                          <Select :default-value="placeholder.month.toString()" @update:model-value="(v) => {
                            if (!v || !placeholder) return;
                            if (Number(v) === placeholder?.month) return;
                            placeholder = placeholder.set({
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

                          <Select :default-value="placeholder.year.toString()" @update:model-value="(v) => {
                            if (!v || !placeholder) return;
                            if (Number(v) === placeholder?.year) return;
                            placeholder = placeholder.set({
                              year: Number(v),
                            })
                            const date = placeholder.toDate()
                            setFieldValue('birthDate', df.format(new Date(date.toISOString())));
                          }">
                            <SelectTrigger aria-label="Select year" class="w-[40%]">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent class="max-h-[200px]">
                              <SelectItem
                                v-for="yearValue in createDecade({ dateObj: date, startIndex: -10, endIndex: 10 })"
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
                              <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
                                <CalendarCellTrigger :day="weekDate" :month="month.value" @click="() => {
                                  const date = weekDate.toDate();
                                  setFieldValue('birthDate', df.format(new Date(date.toISOString())));
                                  placeholder = weekDate;
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
                      <SelectItem v-for="item in filteredPositions" :key="item.code" :value="item.code">
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
              <FormLabel>Chi nhánh</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" disabled />
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
                          !placeholderDateOfIssue && 'text-muted-foreground',
                        )">
                          <span>{{ placeholderDateOfIssue ? df.format(toDate(placeholderDateOfIssue)) : "Chọn ngày cấp"
                          }}</span>
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
                              const date = placeholderDateOfIssue.toDate()
                              setFieldValue('dateOfIssue', df.format(new Date(date.toISOString())));
                            }">
                              <SelectTrigger aria-label="Select year" class="w-[40%]">
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent class="max-h-[200px]">
                                <SelectItem
                                  v-for="yearValue in createDecade({ dateObj: date, startIndex: -10, endIndex: 10 })"
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
                                <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
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
import { Calendar, CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading } from '@/components/ui/calendar'
import { useVModel } from '@vueuse/core'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, today, fromDate } from '@internationalized/date'
import { CalendarIcon, XIcon } from 'lucide-vue-next'
import { CalendarRoot, useDateFormatter, useForwardPropsEmits } from 'reka-ui'
import { toDate, createDecade, createYear } from 'reka-ui/date'
const store = useStore()
const route = useRoute()
const router = useRouter()
const data = ref({})
const currentTab = ref('contract')
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
const props = withDefaults(defineProps(), {
  modelValue: undefined,
  placeholder() {
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

const placeholder = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: data.value.birthDate,
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
    birthDate: z
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
    company: z.string().default('CÔNG TY CỔ PHẦN DEHA VIỆT NAM'),
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

const bankNames = ref([
  { id: 1, label: 'Ngân hàng Vietcombank', code: 'Ngân hàng Vietcombank' },
  { id: 2, label: 'Ngân hàng BIDV', code: 'Ngân hàng BIDV' },
  { id: 3, label: 'Ngân hàng Techcombank', code: 'Ngân hàng Techcombank' },
  { id: 4, label: 'Ngân hàng Agribank', code: 'Ngân hàng Agribank' },
  { id: 5, label: 'Ngân hàng ACB', code: 'Ngân hàng ACB' },
])

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
const filteredPositions = computed(() => {
  if (!values.department) return []
  return positions.value.filter(pos => pos.parentId === values.department)
})
const getStaff = async () => {
  try {
    const code = route.params.code
    const { insurance, employee, salary, contracts } = await EmployeeAPI.get(null, code)
    dataTable.value = contracts
    data.value = employee
    placeholderDateOfIssue.value = parseDate((data.value.personalInfo?.idCard?.issueDate).split('T')[0])
    setFieldValue('employeeId', data.value.employeeId)
    setFieldValue('fullName', data.value.fullName)
    setFieldValue('birthDate', data.value.birthDate)
    setFieldValue('company', data.value.company)
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

const formatDate = (weekDate) => {
  const year = weekDate.year;
  const month = String(weekDate.month).padStart(2, '0');
  const day = String(weekDate.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
const createRowDatePicker = (key, title) => ({
  accessorKey: key,
  header: () => h('div', { class: 'text-center text-sm font-semibold text-gray-700' }, title),
  cell: ({ row }) => {
    const index = row.index
    const currentValue = dataTable.value[index][key]
    const parsedDate = currentValue ? parseDate(currentValue.split('T')[0]) : undefined

    return h(Popover, {}, {
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
          default: () => h(CalendarRoot, {
            modelValue: parsedDate,
            'onUpdate:modelValue': (v) => {
              if (v) {
                const date = v.toDate();
                dataTable.value[index][key] = date.toISOString();
              }
            },
            class: 'rounded-md border p-3'
          }, {
            default: ({ date, grid, weekDays }) => [
              h(CalendarHeader, {}, {
                default: () => h(CalendarHeading, { class: 'flex w-full items-center justify-between gap-2' }, {
                  default: () => [
                    // Select tháng
                    h(Select, {
                      defaultValue: parsedDate?.month.toString(),
                      'onUpdate:modelValue': (v) => {
                        if (!v || !parsedDate) return;
                        if (Number(v) === parsedDate.month) return;
                        const updated = parsedDate.set({ month: Number(v) });
                        dataTable.value[index][key] = formatDate(updated);
                      }
                    }, {
                      default: () => [
                        h(SelectTrigger, { class: 'w-[60%]' }, {
                          default: () => h(SelectValue, { placeholder: "Chọn tháng" })
                        }),
                        h(SelectContent, { class: 'max-h-[200px]' }, {
                          default: () => createYear({ dateObj: date }).map(month =>
                            h(SelectItem, { value: month.month.toString(), key: month.toString() }, {
                              default: () => formatter.custom(toDate(month), { month: 'long' })
                            })
                          )
                        })
                      ]
                    }),

                    // Select năm
                    h(Select, {
                      defaultValue: parsedDate?.year.toString(),
                      'onUpdate:modelValue': (v) => {
                        if (!v || !parsedDate) return;
                        if (Number(v) === parsedDate.year) return;
                        const updated = parsedDate.set({ year: Number(v) });
                        dataTable.value[index][key] = formatDate(updated);
                      }
                    }, {
                      default: () => [
                        h(SelectTrigger, { class: 'w-[40%]' }, {
                          default: () => h(SelectValue, { placeholder: "Chọn năm" })
                        }),
                        h(SelectContent, { class: 'max-h-[200px]' }, {
                          default: () => createDecade({ dateObj: date, startIndex: -10, endIndex: 10 }).map(yearValue =>
                            h(SelectItem, { value: yearValue.year.toString(), key: yearValue.toString() }, {
                              default: () => yearValue.year
                            })
                          )
                        })
                      ]
                    })
                  ]
                })
              }),

              // Calendar Grid
              h('div', { class: 'flex flex-col space-y-4 pt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0' },
                grid.map(month =>
                  h(CalendarGrid, { key: month.value.toString() }, {
                    default: () => [
                      h(CalendarGridHead, {}, {
                        default: () => h(CalendarGridRow, {}, {
                          default: () => weekDays.map(day =>
                            h(CalendarHeadCell, { key: day }, { default: () => day })
                          )
                        })
                      }),
                      h(CalendarGridBody, { class: 'grid' }, {
                        default: () => month.rows.map((weekDates, weekIndex) =>
                          h(CalendarGridRow, { key: `weekDate-${weekIndex}`, class: 'mt-2 w-full' }, {
                            default: () => weekDates.map(weekDate =>
                              h(CalendarCell, { key: weekDate.toString(), date: weekDate }, {
                                default: () => h(CalendarCellTrigger, {
                                  day: weekDate,
                                  month: month.value,
                                  onClick: () => {
                                    const formattedDate = formatDate(weekDate);
                                    dataTable.value[index][key] = formattedDate;
                                  }
                                })
                              })
                            )
                          })
                        )
                      })
                    ]
                  })
                )
              )
            ]
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
onMounted(async () => {
  await getStaff()
  const date = new Date(data.value.birthDate);
  const tz = getLocalTimeZone();
  const calendarDate = fromDate(date, tz);
  placeholder.value = calendarDate
  store.dispatch('app/setBreadcrumb', {
    parentTitle: 'Nhân viên',
    currentTitle: route.params.code,
  })
})
</script>