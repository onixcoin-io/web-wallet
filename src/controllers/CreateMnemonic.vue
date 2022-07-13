<template>
  <v-card class="grey darken-4">
    <v-card-title class="justify-center">
    <v-icon class="pr-2">assignment</v-icon>
      <span class="headline">{{ $t("create_mnemonic.title") }}</span>
    </v-card-title>
    <v-card-text class=text-center v-if="[3, 5].includes(step)">
      <template v-if="step === 3">
      <p align="center">{{ $t("create_mnemonic.remember") }}</p>
        <div>
          <p align="center"><v-chip label v-for="(word, index) in words" :key="index">{{
            word
          }}</v-chip></p>
        </div>
      </template>
      <template v-else-if="step === 5">
        <mnemonic @mnemonic="validateMnemonic"></mnemonic>
      </template>
    </v-card-text>
    <v-layout justify-center>
    <v-card-actions class="pb-4">
      <v-spacer></v-spacer>
      <v-btn class="grey--text  text--darken-3" color="amber" dark @click="createWallet" v-if="step === 1">{{
        $t("create_mnemonic.title")
      }}</v-btn>
      <v-btn class="grey--text text--darken-3" color="amber" dark @click="checkWallet" v-if="step === 3">{{
        $t("create_mnemonic.remembered")
      }}</v-btn>
    </v-card-actions>
    </v-layout>
    <password :open="passwordRequired" title="Please enter your password for Seed Phrase" @password="setPassword"></password>
    <pass :open="passwordRequired" title="Please confirm your password for Seed Phrase" @password="setPassword1"></pass>
  </v-card>
</template>

<script>
import mnemonic from '@/components/Mnemonic'
import password from '@/components/PasswordSeed'
import pass from '@/components/Password1'
import webWallet from '@/libs/web-wallet'
import track from '@/libs/track'

export default {
  data() {
    return {
      step: 1,
      passwordRequired: false,
      inputPassword: '',
      words: [],
      wallet: false
    }
  },
  props: ['view'],
  watch: {
    view: function() {
      this.step = 1
    }
  },
  components: {
    password,
    pass,
    mnemonic
  },
  methods: {
    setPassword(password) {
      if (this.step === 2) {
        this.passwordRequired = false
        this.step = 3
        this.inputPassword = password
        const mnemonic = webWallet.generateMnemonic()
        this.wallet = webWallet.restoreFromMnemonic(mnemonic, password)
        this.words = mnemonic.split(' ')
        track.trackStep('create_from_mnemonic', 2, 3)
      } 
    },
    setPassword1(pass) {
      if (this.step === 4) {
        if (this.inputPassword !== pass) {
          this.$root.error('password_is_not_same_as_the_old_one')
          return false
        }
        this.passwordRequired = false
        this.step = 5
        track.trackStep('create_from_mnemonic', 4, 5)
      }
    },
    createWallet() {
      this.step = 2
      this.passwordRequired = true
      alert('Please note down the password and seed words. The seed words and password must be exactly right or the wallet will create a new address. You will not be able to access the wallet without the seed words and the exact password. If you do not wish to use password, please leave it blank and press confirm. When using Restore from Seed Phrase, confirm you have the correct address.')
      track.trackStep('create_from_mnemonic', 1, 2)
    },
    checkWallet() {
      this.step = 4
      this.passwordRequired = true
      track.trackStep('create_from_mnemonic', 3, 4)
    },
    validateMnemonic(mnemonic) {
      if (!this.wallet.validateMnemonic(mnemonic, this.inputPassword)) {
        this.$root.error('mnemonics_are_not_same_as_the_words_should_remember')
        return false
      }
      track.trackDone('create_from_mnemonic')
      this.$emit('created')
    }
  }
}
</script>
