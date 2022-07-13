<template>
  <div>
    <v-btn block :small="$vuetify.breakpoint.xsOnly" class="grey--text text--darken-3" color="amber" dark :download="downloadName" :href="href" @click="doneClick" target="_blank">
      <marquee behavior="scroll" direction="left" ><slot>{{ $t('file_creator.download') }}</slot></marquee>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    downloadName() {
      return this.download ? this.download : (new Date()).getTime()
    }
  },
  methods: {
    doneClick() {
      this.$emit('click')
    }
  },
  props: ['color', 'download', 'href']
}
</script>
