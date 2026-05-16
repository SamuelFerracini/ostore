<script setup>
const { siteName } = useAppConfig();
</script>

<template>
  <div
    class="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16 bg-white dark:bg-black text-center"
  >
    <p
      class="text-sm font-medium uppercase tracking-wide text-purple-600 dark:text-purple-400"
    >
      {{ siteName }}
    </p>
    <h1
      class="mt-4 text-2xl md:text-3xl font-semibold text-neutral-800 dark:text-neutral-100 max-w-lg leading-snug"
    >
      รับหิ้วรอบต่อไป สิ้นเดือนพฤษภาค่ะ
    </h1>
    <p
      class="mt-4 text-lg text-[#5f5f5f] dark:text-[#b7b7b7] max-w-md leading-relaxed"
    >
      เข้ากลุ่มไลน์ติดตามโปรหน้าได้เลยยยคับบบ ❤️
    </p>
    <img
      src="/qrcode.jpeg"
      alt="LINE group QR code"
      class="mt-8 w-56 max-w-full rounded-2xl shadow-lg border border-black/5 dark:border-white/10"
      width="224"
      height="224"
    />
  </div>
</template>
