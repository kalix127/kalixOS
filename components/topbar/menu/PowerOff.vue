<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const { isPowerOffMenuOpen } = storeToRefs(globalStore);

function closePowerOffMenu() {
  isPowerOffMenuOpen.value = false;
}

const options = [
  {
    name: "Suspend",
    handler: () => {
      console.log("Suspend");
    },
  },
  {
    name: "Restart...",
    handler: () => {
      console.log("Restart");
    },
  },
  {
    name: "Power off...",
    handler: () => {
      console.log("Power off");
    },
  },
  {
    name: "Log out...",
    handler: () => {
      console.log("Log out");
    },
  },
];
</script>

<template>
  <Collapsible :open="isPowerOffMenuOpen">
    <CollapsibleContent v-on-click-outside="closePowerOffMenu">
      <div class="select-none space-y-4 rounded-2xl bg-accent p-4">
        <div class="flex items-center gap-4">
          <div
            class="bg-accent-light grid place-content-center rounded-full p-2"
          >
            <Icon
              name="material-symbols:power-settings-new-rounded"
              size="24"
            />
          </div>
          <span class="text-xl font-bold">Power Off</span>
        </div>
        <div class="space-y-2">
          <!-- TODO: Maybe add spacing between the last button and its border top -->
          <Button
            v-for="option in options"
            :key="option.name"
            @click="option.handler"
            variant="ghost"
            class="hover:bg-accent-light w-full cursor-default justify-start rounded-xl font-medium duration-0 last:mt-2 last:rounded-none last:border-t last:border-t-accent last:hover:rounded-xl"
            >{{ option.name }}</Button
          >
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>

<style scoped></style>
