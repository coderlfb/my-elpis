<template>
  <h1>page1</h1>
  <el-input v-model="content" style="width: 100px" />
  <el-table :data="tableData">
    <el-table-column prop="name" label="name" width="180" />
    <el-table-column prop="desc" label="desc" />
  </el-table>
  <div>{{ content }}</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import $curl from "$common/curl";

const content = ref("");
console.log("page1 init");

const tableData = ref([
  {
    name: "name1",
    desc: "desc1",
  },
  {
    name: "name2",
    desc: "desc2",
  },
]);

onMounted(async () => {
  const res = await $curl({
    url: "/api/project/list",
    method: "get",
    query: {
      proj_key: "test",
    },
  });
  tableData.value = res.data;
});
</script>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>
