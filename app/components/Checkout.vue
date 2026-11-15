<script setup>
const { userDetails, checkoutStatus, handleCheckout } = useCheckout();
const { cart } = useCart();
</script>

<template>
  <div class="md:w-96 h-full bg-white dark:bg-midnight-surface border border-gold-line dark:border-midnight-line text-navy dark:text-[#EEF2F8] my-3 mr-3 p-3 max-md:ml-3 rounded-3xl">
    <div class="font-display-th text-xl font-semibold px-2 mb-3">ชำระเงิน</div>
    <form @submit.prevent="handleCheckout" class="flex flex-col items-center justify-center">
      <div class="grid grid-cols-2 gap-3 billing w-full">
        <div class="col-span-full">
          <input required v-model="userDetails.email" placeholder="อีเมล" aria-label="อีเมล" name="email" type="email" class="" />
        </div>
        <div class="col-span-1">
          <input required v-model="userDetails.firstName" placeholder="ชื่อ" aria-label="ชื่อ" name="first-name" type="text" />
        </div>
        <div class="col-span-1">
          <input required v-model="userDetails.lastName" placeholder="นามสกุล" aria-label="นามสกุล" name="last-name" type="text" />
        </div>
        <div class="col-span-1">
          <input required v-model="userDetails.phone" placeholder="เบอร์โทรศัพท์" aria-label="เบอร์โทรศัพท์" name="phone" type="text" />
        </div>
        <div class="col-span-1">
          <input required v-model="userDetails.city" placeholder="จังหวัด / เมือง" aria-label="จังหวัด / เมือง" name="city" type="text" />
        </div>
        <div class="col-span-full">
          <textarea required v-model="userDetails.address1" placeholder="ที่อยู่จัดส่ง" aria-label="ที่อยู่จัดส่ง" name="address" rows="2"></textarea>
        </div>
      </div>
      <div class="text-sm font-semibold p-4 text-muted dark:text-[#B7C3D9]">
        ยอดชำระรวม {{ cart.reduce((total, item) => total + parseFloat(item.variation.node.salePrice), 0).toFixed(2) }} ฿ สำหรับสินค้า {{ cart.length }} รายการ
      </div>
      <button
        type="submit"
        :disabled="checkoutStatus !== 'order'"
        class="pay-button-bezel w-full h-[54px] rounded-full relative font-semibold text-navy text-lg flex justify-center items-center focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle">
        <Transition name="slide-up">
          <div v-if="checkoutStatus === 'order'" class="absolute">ชำระเงิน {{ cart.reduce((total, item) => total + parseFloat(item.variation.node.salePrice), 0).toFixed(2) }} ฿</div>
          <UIcon v-else-if="checkoutStatus === 'processing'" class="absolute" name="i-svg-spinners-90-ring-with-bg" size="22" />
        </Transition>
      </button>
      <div class="text-xs font-medium p-4 flex gap-1 items-end text-muted dark:text-[#B7C3D9]">
        <UIcon name="i-iconamoon-lock-fill" size="18" />
        <div>การชำระเงินของคุณปลอดภัยด้วย Stripe</div>
      </div>
    </form>
  </div>
</template>

<style lang="postcss">
:root {
  --background: #fff;
  --border: #E8DDC2;
}
.dark {
  --background: #16223A;
  --border: #2A3A57;
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px var(--background, #fff) inset !important;
  box-shadow: 0 0 0px 1000px var(--background, #fff) inset !important;
  border-color: var(--border) !important;
}

.billing input,
.billing textarea {
  @apply block bg-field dark:bg-midnight w-full min-h-[44px] font-medium border border-sky dark:border-midnight-line transition hover:border-royal dark:hover:border-periwinkle rounded-2xl py-3 px-4 text-navy dark:text-[#EEF2F8] placeholder:text-muted text-sm leading-6 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-periwinkle;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
textarea {
  resize: none;
}
.pay-button-bezel {
  box-shadow: 0 0 0 var(--button-outline, 0px) rgba(197, 162, 83, 0.3), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
    0 1px 1px 0 rgba(0, 0, 0, 0.3);
  @apply bg-gold dark:bg-[#D8B868] outline-none tracking-[-0.125px] transition scale-[var(--button-scale,1)] duration-200;
  &:hover {
    @apply brightness-110;
  }
  &:active {
    --button-outline: 4px;
    --button-scale: 0.975;
  }
}
</style>
