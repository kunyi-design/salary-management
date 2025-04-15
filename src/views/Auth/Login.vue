<template>
  <div class="flex items-center justify-center h-screen w-full relative px-6">
    <Card class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu để đăng nhập vào tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="hienntt@gmail.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <div class="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <a href="#" class="text-sm underline hover:text-primary">Quên mật khẩu?</a>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full">Đăng nhập</Button>
        </form>

        <div class="mt-4 text-center text-sm">
          Chưa có tài khoản?
          <router-link to="/register" class="underline hover:text-primary">Đăng ký</router-link>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import AuthAPI from '@/services/api/AuthAPI' // Giả sử bạn đã có API login

const router = useRouter()

// Schema validate
const formSchema = toTypedSchema(z.object({
  email: z.string({ required_error: 'Vui lòng nhập email' })
    .email({ message: 'Email không hợp lệ' }),
  password: z.string({ required_error: 'Vui lòng nhập mật khẩu' })
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
}))

// Sử dụng useForm
const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await AuthAPI.post('/login', values)
    toast.success('Đăng nhập thành công!')
    localStorage.setItem('token', res.token)
    router.push('/')
  } catch (err) {
    toast.error(err.message || 'Đăng nhập thất bại')
  }
})
</script>
