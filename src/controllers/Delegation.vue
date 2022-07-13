<template>
  <v-card class="grey darken-4">
    <v-card-title class="justify-center">
    <v-icon class="pr-2">gavel</v-icon>
      <span class="headline">{{ $t("delegation.title") }}</span>
    </v-card-title>
    <v-card-text>
      <DelegationHeadAction :wallet="wallet" @notify="notify" />
      <DelegationInfo
        v-show="
          wallet &&
            wallet.info.delegateStatus !== 'none' &&
            wallet.info.delegateStatus !== 'delDelegation'
        "
        :wallet="wallet"
        @notify="notify"
      />
      <!-- 信息提示 -->
      <v-snackbar v-model="snackbarShow" top right :color="tip.type" clearable>
        <section>
          {{ tip.msg }}
        </section>
        <v-btn icon small @click="snackbarShow = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    <v-layout class="pt-4"></v-layout>
    <v-layout class="pt-4" style="border-top: 1px solid #666">
    <section class="title">Superstaker Info</section>
    </v-layout>
    <v-layout class="pt-2">
    <v-flex xs4>
    <span class="amber--text">Name</span>
    </v-flex>
    <v-flex xs4>
    <span class="amber--text">Address</span>
    </v-flex>
    <v-flex xs4>
    <span class="amber--text">Fee(%)</span>
    </v-flex>
    </v-layout>
    <v-layout class="pt-2" v-for="item in superstaker" :key="item">
    <v-flex xs4 class="pt-2">
    <span>{{ item.name }}</span>
    </v-flex>
    <v-flex xs4 class="pt-2">
    <span><p style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">{{ item.address }}</p></span>
    </v-flex>
    <v-flex xs1 class="pt-2">
    <span>{{ item.fee }}</span>
    </v-flex>
    <v-flex xs2 class="pb-4">
          <v-btn 
            :small="$vuetify.breakpoint.xsOnly"
            class="grey--text text--darken-3" 
            color="amber"
            v-clipboard:copy=item.address
          >
            {{ $t("common.copy") }}
          </v-btn>
    </v-layout>      
    </v-card-text>
  </v-card>
</template>

<script>
import webWallet from '@/libs/web-wallet'

import DelegationInfo from '@/components/Delegation/Info'
import DelegationHeadAction from '@/components/Delegation/HeadAction'

export default {
  data() {
    return {
      superstaker: [{name: 'The Onixcoin Shrine', address:'XBnfbZQLQagWkzWf5StYbRP5E7Q6YYsXMy', fee:'100'},
                    {name: 'The BCF Shrine', address:'XG6ncE5tGg72CRHKgn3PHpCAchWY21qWuK', fee:'100'},
                    {name: 'Onix Team Superstaking Pool', address:'XENBdGZv31NmfBkRVorBEQswcUSRbNtFrf', fee:'10'},
                    {name: 'Blockchain Financial Superstaking Pool', address:'XEGwea1yVR8bKucPzWRS6nSS3SSio1D44t', fee:'10'},
                    {name: 'Army of Onix Superstaking Pool', address:'XEgRiUhdxVbVhFf887Jdw7VkX3i7aTh7ry', fee:'10'},
                    {name: 'Tyrell Corporation superstaker', address:'XaYrhGrZJYqanNtmHVxac3guhQTa33fa3Z', fee:'10'},
                    {name: 'The Wizard Superstaker', address:'XJpcHZaJtR6JVPSYYiz6u4kkaN4srR3Tt3', fee:'10'},
                    {name: 'Austria/German Superstake Power Pool', address:'XYqKNvrftHuW8Hnoh2AhysUmiYrB2bCNQE', fee:'10'},
                    {name: 'Ireland/UK Superstaking Pool', address:'XZU4z9MEfrmnHALgMxbyRLaghN6FDWjg4v', fee:'10'}],
      wallet: webWallet.getWallet(),
      snackbarShow: false,
      tip: {
        type: 'error',
        msg: ''
      }
    }
  },
  props: ['view'],
  watch: {
    view: async function(newVal) {
      if (newVal) {
        this.wallet = webWallet.getWallet()
        this.wallet.setInfo()
      }
    }
  },
  components: {
    DelegationInfo,
    DelegationHeadAction
  },
  methods: {
    notify(message, type) {
      this.snackbarShow = true
      this.tip.msg = message
      this.tip.type = type
    }
  }
}
</script>
