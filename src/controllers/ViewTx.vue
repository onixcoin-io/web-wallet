<template>
  <v-card class="grey darken-4">
    <v-card-title class="justify-center">
    <v-icon class="pr-2">list</v-icon>
      <span class="headline">{{ $t("view_tx.title") }}</span>
    </v-card-title>
    <v-card-text>
      <p>{{ $t("view_tx.recent") }}</p>
      <div v-for="(tx, id) in txList" :key="id">
        <v-layout class="pt-4">
          <v-flex xs5>
            {{ $t("view_tx.tx") }}
              <a :block="$vuetify.breakpoint.xsOnly" 
              class="white--text"
              light :href="node.getTxExplorerUrl(tx.id)" target="_blank" style="max-width:550px" ><p
            style="
                max-width: 550px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >{{ tx.id }}</p></a>
          </v-flex>
          <v-flex xs1>
          </v-flex>
          <v-flex xs6>
          <p
            style="
                max-width: 550px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
            {{ $t("view_tx.mined_at")
            }}{{ new Date(tx.timestamp * 1000).toString() }}
          </p>
          </v-flex>
        </v-layout>
        <v-layout>
        <v-flex xs5>
        <span class="amber--text">Sender</span>
        </v-flex>
        <v-flex xs1>
        </v-flex>
        <v-flex xs6>
        <span class="amber--text">Receiver</span>
        </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs2>
            <p
              v-for="(vtx, vid) in tx.inputs"
              :key="vid"
              :class="vtx.address === wallet.info.address ? 'white--text' : ''"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              <template v-if="vtx.address">
                {{ vtx.address }}
              </template>
            </p>
          </v-flex>
          <v-flex xs2 text-xs-right>
            <p
              v-for="(vtx, vid) in tx.inputs"
              :key="vid"
              :class="vtx.address === wallet.info.address ? 'white--text' : ''"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 100px;"
            >
              <template v-if="vtx.address">
                {{ parseFloat(Wallet.changeUnitFromSatTo1(vtx.value).replace(/,/g, '')).toFixed(2) }}
              </template>
            </p>
          </v-flex>
          <v-flex xs1 text-xs-right>
            <p
              v-for="(vtx, vid) in tx.inputs"
              :key="vid"
              :class="vtx.address === wallet.info.address ? 'white--text' : ''"
            >
              <template v-if="vtx.address"> ONIX </template>
            </p>
          </v-flex>
          <v-flex xs1>
          </v-flex>
          <v-flex xs2>
            <p
              v-for="(vtx, vid) in tx.outputs"
              :key="vid"
              :class="vtx.address === wallet.info.address ? 'white--text' : ''"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              <template v-if="vtx.address">
                {{ vtx.address }}
              </template>
            </p>
          </v-flex>
          <v-flex xs1>
          </v-flex>
          <v-flex xs2 text-xs-right>
            <p
              v-for="(vtx, vid) in tx.outputs"
              :key="vid"
              :class="vtx.address === wallet.info.address ? 'white--text' : ''"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 100px;"
            >
              <template v-if="vtx.address">
                {{ parseFloat(Wallet.changeUnitFromSatTo1(vtx.value).replace(/,/g, '')).toFixed(2) }}
              </template>
            </p>
          </v-flex>
          <v-flex xs1 text-xs-right>
            <p
              v-for="(vtx, vid) in tx.outputs"
              :key="vid"
              :class="vtx.address === wallet.info.address ? 'white--text' : ''"
            >
              <template v-if="vtx.address"> ONIX </template>
            </p>
          </v-flex>
        </v-layout>
        <v-layout style="border-bottom: 1px solid">
        <v-chip-group :class="!$vuetify.breakpoint.xsOnly">
          <v-flex xs4>
          </v-flex>
          <v-flex xs4 class="pb-4">
            <v-chip label class="white--text">
              {{ $t("view_tx.fee") }}{{ Wallet.changeUnitFromSatTo1(tx.fees) }}
            </v-chip>
          </v-flex>
          <v-flex xs4>
          </v-flex>
        </v-chip-group>
        </v-layout>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import webWallet from '@/libs/web-wallet'
import Wallet from '@/libs/wallet'
import server from '@/libs/server'

export default {
  data() {
    return {
      wallet: webWallet.getWallet(),
      node: server.currentNode(),
      Wallet
    }
  },
  props: ['view'],
  watch: {
    view: function () {
      this.wallet.setTxList()
    }
  },
  computed: {
    txList: function () {
      return this.wallet.txList
    }
  },
  mounted() {
    this.wallet.update()
  }
}
</script>
