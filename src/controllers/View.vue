<template>
  <v-card class="grey darken-4">
    <v-card-title class="justify-center">
    <v-icon class="pr-2">account_balance_wallet</v-icon>
      <span class="headline">{{ $t("view.title") }}</span>
    </v-card-title>
    <v-card-text>
      <v-layout v-for="(item, i) in infoLabel" :key="i">
        <v-flex xs3 class="pt-2">
          <v-subheader class="ma-0 pa-0">
            {{ $t("common.info." + item.label) }}
          </v-subheader>
        </v-flex>
        <v-flex xs6 class="pb-4">
          <v-text-field v-model="info[item.name]" disabled></v-text-field>
        </v-flex>
        <v-flex xs2 class="pt-3">
          <v-btn 
            :small="$vuetify.breakpoint.xsOnly"
            class="grey--text text--darken-3" 
            color="amber"
            v-clipboard:copy="info[item.name]"
            v-clipboard:success="onCopySucc"
            v-clipboard:error="onCopyError"
            v-if="item.copy"
          >
            {{ $t("common.copy") }}
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout class="view-private" v-if="privKey !== null">
        <v-flex xs3 class="pt-2">
          <v-subheader class="ma-0 pa-0">
            {{ $t("common.info.priv_key") }}
          </v-subheader>
        </v-flex>
        <v-flex xs5 class="ma-0 pa-0">
          <v-text-field
            v-model="privKey"
            disabled
            :type="showPriv ? 'text' : 'password'"
          >
          </v-text-field>
        </v-flex>
        <v-flex xs1>       
            <v-icon class="pl-1 pt-4" @click="showPriv = !showPriv">{{ showPriv ? 'visibility_off' : 'visibility' }}</v-icon>
        </v-flex>
        <v-flex xs2 class="pt-3">
          <v-btn
            :small="$vuetify.breakpoint.xsOnly"
            class="grey--text text--darken-3" 
            color="amber"
            v-show="showPriv"
            v-clipboard:copy="privKey"
            v-clipboard:success="onCopySucc"
            v-clipboard:error="onCopyError"
          >
            {{ $t("common.copy") }}
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-if="wallet.info.orc20.length > 0">
        <v-flex xs3>
          <v-subheader class="ma-0 pl-0"> ORC20 </v-subheader>
        </v-flex>
        <v-flex xs7 class="pb-4">
          <v-card
            flat
            tile
            :color="'grey darken-' + ((i % 2) + 1)"
            style="border-bottom: 2px solid #000; padding: 10px 10px"
            v-for="(token, i) in wallet.info.orc20"
            :key="i"
          >
            <v-layout>
              <v-flex xs5>
              <p style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 70px;"
            >{{ token.name }}</v-flex>
              <v-flex xs4>{{ token.balance }}</v-flex> <v-flex xs3>{{ token.symbol }}</v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <nft-list></nft-list>
    </v-card-text>
  </v-card>
</template>

<script>
import NFTList from '@/components/NFT/NFTList.vue'
import webWallet from '@/libs/web-wallet'
import track from '@/libs/track'

export default {
  data() {
    return {
      infoLabel: [
        { label: 'address', name: 'address', copy: true },
        { label: 'balance', name: 'balance' },
        { label: 'unconfirmed_balance', name: 'unconfirmedBalance' }
      ],
      wallet: webWallet.getWallet(),
      showPriv: false
    }
  },
  components: {
    'nft-list': NFTList
  },
  props: ['view'],
  watch: {
    view: function () {
      this.wallet.setInfo()
    }
  },
  computed: {
    info: function () {
      return this.wallet.info
    },
    privKey: function () {
      return this.wallet.getPrivKey()
    }
  },
  mounted() {
    this.wallet.update()
  },
  methods: {
    onCopySucc: function () {
      track.trackAction('copy', 'view', 'privkey')
      this.$root.success('Copied')
    },
    onCopyError: function () {
      this.$root.error('Failed to copy')
    }
  }
}
</script>
<style lang="less" scoped>
.view-private {
  position: relative;
  &-line {
    display: flex;
    align-items: center;
    .theme--dark.v-icon {
      color: hsla(0,0%,100%,.7);
    }
  }

}
</style>
