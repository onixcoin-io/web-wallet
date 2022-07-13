<template>
  <v-card class="grey darken-4">
    <v-card-title class="justify-center">
    <v-icon class="pr-2">cloud_download</v-icon>
      <span class="headline">{{ $t("dump_as_key_file.title") }}</span>
    </v-card-title>
    <v-card-text>
      <v-alert class="grey--text text--darken-3" color="amber" value="true">{{
        $t("dump_as_key_file.warning")
      }}</v-alert>
      <file-creator v-if="fileStr" color="green" :href="fileStr"></file-creator>
      <password
        :open="passwordRequired"
        notEmpty="true"
        title="dump_as_key_file.password_title"
        @password="inputed"
      ></password>
    </v-card-text>
  </v-card>
</template>

<script>
import password from '@/components/Password'
import fileCreator from '@/components/FileCreator'
import keyfile from '@/libs/keyfile'
import webWallet from '@/libs/web-wallet'

export default {
  data() {
    return {
      passwordRequired: true,
      wallet: webWallet.getWallet(),
      fileStr: false
    }
  },
  components: {
    password,
    fileCreator
  },
  methods: {
    inputed(password) {
      this.passwordRequired = false
      this.fileStr =
        'data:text/plain,' +
        keyfile.build(keyfile.encode(this.wallet.getPrivKey(), password))
    }
  }
}
</script>
