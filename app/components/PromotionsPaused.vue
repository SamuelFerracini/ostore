<script setup>
const { siteName } = useAppConfig();
</script>

<template>
  <div
    class="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-16 bg-ivory dark:bg-midnight text-center"
  >
    <div class="h-1 w-16 rounded-full bg-gold" aria-hidden="true"></div>
    <p
      class="mt-6 font-display text-2xl font-semibold text-navy dark:text-night-text"
    >
      {{ siteName }}
    </p>
    <h1
      class="mt-4 font-display-th text-2xl md:text-3xl font-semibold text-navy dark:text-night-text max-w-lg leading-snug"
    >
      รับหิ้วรอบต่อไป สิ้นเดือนพฤษภาค่ะ
    </h1>
    <p
      class="mt-4 text-lg text-muted dark:text-night-muted max-w-md leading-relaxed"
    >
      เข้ากลุ่มไลน์ติดตามโปรหน้าได้เลยยยคับบบ ❤️
    </p>
    <img
      src="/qrcode.jpeg"
      alt="QR code กลุ่มไลน์"
      class="mt-8 w-56 max-w-full rounded-2xl border border-gold-line bg-white p-2 dark:border-midnight-line"
      width="224"
      height="224"
    />
  </div>
</template>
