<template>
  <div class="flex items-center justify-center h-screen w-full px-6">
    <Card class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Đăng ký</CardTitle>
        <CardDescription>
          Điền thông tin bên dưới để tạo tài khoản mới của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="hienntt@gmail.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="role">
            <FormItem>
              <FormLabel>Quyền</FormLabel>
              <FormControl>
                <Select v-model="roleValue">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Chọn quyền" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in roles" :key="item.value" :value="item.value">
                        {{ item.label }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <template v-if="isLoading">
            <Button disabled>
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
            </Button>
          </template>
          <template v-else>
            <Button type="submit" class="w-full">Đăng ký</Button>
          </template>
        </form>
        <div class="mt-4 text-center text-sm">
          Đã có tài khoản?
          <a href="/login" class="underline hover:text-primary">
            Đăng nhập
          </a>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { computed, ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import AuthAPI from '@/services/api/AuthAPI'

const roles = ref([
  { id: 1, label: 'Admin', value: 'admin' },
  { id: 2, label: 'HR', value: 'hr' },
  { id: 3, label: 'Kế toán', value: 'ketoan' },
])
const isLoading = ref(false)
const router = useRouter()
const formSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: 'Vui lòng nhập email' })
      .email({ message: 'Email không hợp lệ' })
      .max(50, { message: 'Email không được quá 50 ký tự' }),
    password: z
      .string({ required_error: 'Vui lòng nhập password' })
      .min(6, { message: 'Password phải có ít nhất 6 ký tự' }),
    role: z
      .string({ required_error: 'Vui lòng chọn quyền' })
      .nonempty({ message: 'Vui lòng chọn quyền' })
  })
)
const roleValue = computed({
  get: () => values.role,
  set: val => setFieldValue('role', val),
})
const { isFieldDirty, handleSubmit, values, setFieldValue } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    const res = await AuthAPI.post('/register', values)
    toast.success(res.message)
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }
  catch (err) {
    toast.error(err.message)
  } finally {
    isLoading.value = false
  }
})
</script>
