<template>
  <client-only>
    <el-dialog v-bind="$attrs" append-to-body :with-header="false">
      <template v-for="(index, name) in $slots" #[name]><slot :name="name" /></template>
    </el-dialog>
  </client-only>
</template>

<style lang="scss">
.el-dialog {
  max-width: 370px;
  width: calc(100% - 60px);

  .el-dialog__body {
    padding: 20px;
  }
}
</style>
