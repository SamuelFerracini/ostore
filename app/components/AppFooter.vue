<script setup>
const config = useRuntimeConfig();
const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const colorModeIcon = computed(() =>
  colorMode.preference === "dark"
    ? "i-iconamoon-mode-dark-fill"
    : "i-iconamoon-mode-light-fill"
);
</script>

<template>
  <div
    class="flex justify-between bottom-0 w-full flex-row items-center px-3 lg:px-5 h-[72px] lg:h-20 z-40 fixed bg-white/85 dark:bg-black/85 backdrop-blur-sm dark:backdrop-blur-lg"
  >
    <div class="flex flex-col gap-1 text-sm md:text-base">
      <p>ช็อปออสเตรเลีย ราคารวมทุกอย่างพร้อมกล่องและถุง 💖</p>
      <p>
        อาจเปลี่ยนแปลงตามโปรช่วงนั้นนะคะ ถ้าต้องการใบเสร็จทักสอบถามได้นะคะ 🙏🏼
      </p>
    </div>
    <a href="https://www.facebook.com/nonlapan.smpt">
      <UIcon
        class="text-[#5f5f5f] dark:text-[#b7b7b7] min-w-12 min-h-12 flex items-center justify-center rounded-full cursor-pointer relative"
        name="i-ic:baseline-facebook"
        size="40"
      />
    </a>
  </div>
</template>
