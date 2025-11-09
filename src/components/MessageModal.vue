<script setup>
const props = defineProps({
  
  title: {
    type: String,
    required: true,
  },
  handleOk: {
    type: Function,
    required: true,
  },
  handleCancel: {
    type: Function,
    required: true,
  },
 
});
</script>

<template>
  <div class="modal modal-open">
    <div class="modal-box text-center">
      <h3
        class="font-bold text-[14px] md:text-[16px] lg:text-[18px]"
      >
        {{ title }}
      </h3>
      
      <div class="modal-action justify-center">
        <button @click="handleCancel" class="btn btn-soft btn-primary">
          Cancel
        </button>
        <button @click="handleOk" class="btn btn-primary">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
