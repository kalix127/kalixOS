<script setup lang="ts">
const { isOpen, targetType, targetNode, contextMenuStyle, menuOptions }
  = useContextMenu();
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
        <div
          class="space-y-2"
          @contextmenu.prevent=""
        >
          <!-- Target name -->
          <div
            v-if="targetType === 'dock'"
            class="flex items-center gap-4 px-1"
          >
            <span
              class="select-none text-nowrap text-xs font-bold text-muted-foreground"
            >
              {{
                targetNode?.isTranslated
                  ? $t(targetNode.name)
                  : targetNode?.name
              }}
            </span>
            <div class="h-px w-full bg-muted-foreground/15" />
          </div>

          <!-- Options  -->
          <div
            v-for="(option, index) in menuOptions"
            :key="option.label"
          >
            <DropdownMenuSeparator
              v-if="'isSeparator' in option && option.isSeparator"
              :class="[index === 0 ? 'hidden' : '']"
            />
            <DropdownMenuItem
              v-else
              :inset="targetType !== 'dock'"
              class="font-medium duration-0"
              :class="{ 'min-h-9': targetType === 'dock' }"
              @click="option.action"
            >
              {{ option.label }}
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </Teleport>
</template>

<style scoped></style>
