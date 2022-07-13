<template>
<v-layout justify-center>
  <v-btn class="grey--text text--darken-3" color="amber" @click="clickBtn">
    <slot>{{ $t('file_reader.upload') }}</slot>
    <input type="file" style="display: none;" @change="handleFiles" ref="input"/>
  </v-btn>
</v-layout>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: ['color'],
  methods: {
    clickBtn() {
      this.$refs.input.click()
    },
    handleFiles(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      const vue = this
      reader.onload = function() {
        vue.$emit('upload', {
          content: this.result
        })
      }
      reader.readAsText(file)
    }
  }
}
</script>
