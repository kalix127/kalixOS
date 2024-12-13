import VueDraggableResizable from "vue-draggable-resizable";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("vue-draggable-resizable", VueDraggableResizable);
});
