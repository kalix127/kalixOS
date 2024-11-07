<script setup lang="ts">
const { isOpen, x, y, targetType, targetNode, contextMenuStyle, menuOptions } =
  useContextMenu();
</script>
<template>
  <Teleport to="body">
    <DropdownMenu :open="isOpen">
      <DropdownMenuContent
        class="z-[60000]"
        :class="[targetType === 'dock' ? '!w-60' : '!w-72']"
        :style="contextMenuStyle"
        as-child
      >
        <div class="space-y-2" @contextmenu.prevent="">
          <!-- Target name -->
          <div
            v-if="targetType === 'dock'"
            class="flex items-center gap-4 px-1"
          >
            <span
              class="select-none text-nowrap text-xs font-extrabold text-muted-foreground"
            >
              {{ $t(targetNode?.name) }}
            </span>
            <div class="h-px w-full bg-muted-foreground/15"></div>
          </div>

          <!-- Options -->
          <template v-for="(option, index) in menuOptions" :key="option.label">
            <DropdownMenuSeparator
              v-if="option.isSeparator"
              :class="[index === 0 ? 'hidden' : '']"
            />
            <DropdownMenuItem
              @click="option.action"
              :inset="targetType !== 'dock'"
              class="duration-0"
              :class="[targetType === 'dock' ? 'min-h-9' : '']"
              v-else
            >
              {{ option.label }}
            </DropdownMenuItem>
          </template>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </Teleport>
</template>

<style scoped></style>
