<template>
  <v-app dark class="black">
    <v-navigation-drawer  class="black" v-model="drawer" :permanent="!$vuetify.breakpoint.xsOnly" clipped app>
    <v-img src="https://drive.google.com/uc?export=view&id=1rU9DZsB-sLzpm41H18IZjT8MFPrgghTm"  
            height="100%"
            >
      <v-list class="pa-0">
        <template v-for="(item, i) in menu">
          <v-divider
            dark
            v-if="item.divider"
            class="my-4"
            :key="i"
            v-show="!notShow[item.name]"
          ></v-divider>
          <v-list-tile
            :key="i"
            v-else
            style="background-color:rgba(85,85,85,0.25)"
            @click="changeView(item.name)"
            active-class="grey darken-4"
            v-model="isCurrent[item.name]"
            v-show="!notShow[item.name]"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">
                {{ $t("common.menu." + item.name) }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :class="headerClass" app fixed clipped-left>
    <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title">
        <img src="./assets/images/logo.png" style="float:left;height:23px;padding-right:7px;">
        <span class="text" style="color:#ffc107">ONIX</span>
        <span style="color:#ffc107" @click="changeView('settings')">
          - Web Wallet
        </span>
        <v-btn flat @click="changeView('settings')" v-if="mode !== 'normal'">
          {{ $t("common.mode." + mode) }}
        </v-btn>
      </span>
    </v-toolbar>
    <main>
      <v-content>
      <v-card class="grey darken-4 ">
              <p align="center"><v-icon>warning</v-icon>You are using web wallet on the browser and you will be logged out of wallet if the page is refreshed. Remeber to back up your wallet.</p>
            </v-card>
        <v-container class="black" fluid justify-center>
          <v-layout row wrap>
            <v-flex>
              <create-wallet
                :view="isCurrent['create']"
                @created="setWallet"
                v-show="isCurrent['create']"
              ></create-wallet>
              <create-mnemonic
                :view="isCurrent['create_from_mnemonic']"
                @created="setWallet"
                v-show="isCurrent['create_from_mnemonic']"
              ></create-mnemonic>
              <restore-wallet
                @restored="setWallet"
                v-show="isCurrent['restore_from_mnemonic']"
              ></restore-wallet>
              <restore-wif
                @restored="setWallet"
                v-show="isCurrent['restore_from_wif']"
              ></restore-wif>
              <restore-mobile
                @restored="setWallet"
                v-show="isCurrent['restore_from_mobile']"
              ></restore-mobile>
              <restore-key-file
                @restored="setWallet"
                v-show="isCurrent['restore_from_key_file']"
              ></restore-key-file>
              <restore-ledger
                @restored="setWallet"
                v-if="isCurrent['restore_from_ledger']"
              ></restore-ledger>
              <view-wallet
                :view="isCurrent['view']"
                v-if="isCurrent['view']"
              ></view-wallet>
              <view-tx
                :view="isCurrent['transactions']"
                v-if="isCurrent['transactions']"
              ></view-tx>
              <safe-send
                @send="setWallet"
                v-if="isCurrent['safe_send']"
              ></safe-send>
              <send @send="setWallet" v-if="isCurrent['send']"></send>
              <request-payment
                v-if="isCurrent['request_payment']"
              ></request-payment>
              <dump-key-file
                v-if="isCurrent['dump_as_key_file']"
              ></dump-key-file>
              <create-token v-if="isCurrent['create_token']"></create-token>
              <create-contract
                v-if="isCurrent['create_contract']"
              ></create-contract>
              <send-to-contract
                v-if="isCurrent['send_to_contract']"
              ></send-to-contract>
              <call-contract v-if="isCurrent['call_contract']"></call-contract>
              <create-nft v-if="isCurrent['create_NFT']"></create-nft>
              <delegation
                :view="isCurrent['delegation']"
                v-if="isCurrent['delegation']"
              ></delegation>
              <logout
                :view="isCurrent['logout']"
                v-if="isCurrent['logout']"
              >
              <v-card class="grey darken-4">
              <v-card-title class="justify-center">
              <v-icon class="pr-2">repeat</v-icon>
              <span class="headline">Logout of Wallet</span>
              </v-card-title>
              <v-card-text>
                <v-layout>
                  <v-flex xs2>
                  </v-flex>
                  <v-flex xs10>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-layout justify-center>
              <v-card-actions class="pb-4">
                <v-btn class="justify-center grey--text text--darken-3" color="amber" @click="reloadPage">LOGOUT</v-btn>
              </v-card-actions>
              </v-layout>
            </v-card>
              </logout>
              <config v-if="isCurrent['settings']"></config>
            </v-flex>
          </v-layout>
          <div style="padding-top:60px">
          <v-layout justify-center>
          <v-img src="https://drive.google.com/uc?export=view&id=1ZqfHc6HDq-lgVVX7jQPjShBozW39_7sy"
            max-height="254"
            max-width="274">
          </v-layout>
          </div>
        </v-container>
      </v-content>
    </main>
    <notify></notify>
    <warning></warning>
  </v-app>
</template>

<script>
import Vue from 'vue'
import createLog from 'localstorage-logger'

//Components
import Notify from '@/components/Notify'
import Warning from '@/components/Warning'
import CreateWallet from '@/controllers/Create'
import CreateMnemonic from '@/controllers/CreateMnemonic'
import RestoreWallet from '@/controllers/Restore'
import RestoreWif from '@/controllers/RestoreWif'
import RestoreMobile from '@/controllers/RestoreMobile'
import RestoreKeyFile from '@/controllers/RestoreKeyFile'
import RestoreLedger from '@/controllers/RestoreLedger'
import ViewWallet from '@/controllers/View'
import ViewTx from '@/controllers/ViewTx'
import SafeSend from '@/controllers/SafeSend'
import Send from '@/controllers/Send'
import RequestPayment from '@/controllers/RequestPayment'
import DumpKeyFile from '@/controllers/DumpKeyFile'
import CreateToken from '@/controllers/CreateToken'
import CreateContract from '@/controllers/CreateContract'
import SendToContract from '@/controllers/SendToContract.vue'
import CallContract from '@/controllers/CallContract.vue'
import CreateNft from '@/controllers/CreateNFT.vue'
import Config from '@/controllers/Config'
import Delegation from '@/controllers/Delegation'

import config from '@/libs/config'
import webWallet from '@/libs/web-wallet'
import i18n from '@/libs/i18n'
import track from '@/libs/track'

import onixInfo from '@/libs/nodes/onixInfo'

const log = createLog({
  maxLogSizeInBytes: 500 * 1024 // 500KB
})

export default {
  name: 'app',
  i18n,
  data() {
    return {
      drawer: false,
      wallet: false,
      current: 'create_from_mnemonic',
      network: config.getNetwork(),
      mode: config.getMode(),
      log: log,
      menu: [
        { icon: 'assignment', name: 'create_from_mnemonic' },
        { icon: 'sms', name: 'restore_from_mnemonic' },
        { icon: 'vpn_key', name: 'restore_from_wif' },
        { icon: 'cloud_upload', name: 'restore_from_key_file' },
        { icon: 'account_balance_wallet', name: 'view' },
        { divider: true, name: 'stake' },
        { icon: 'gavel', name: 'delegation' },
        { divider: true, name: 'wallet' },
        { icon: 'repeat', name: 'send' },
        { icon: 'undo', name: 'request_payment' },
        { icon: 'list', name: 'transactions' },
        { icon: 'security', name: 'safe_send' },
        { icon: 'cloud_download', name: 'dump_as_key_file' },
        { divider: true, name: 'contract' },
        { icon: 'copyright', name: 'create_token' },
        { divider: true, name: 'disc' },
        { icon: 'settings', name: 'settings' },
        { icon: 'repeat', name: 'logout' }
      ],
      notifyList: {},
      delegationShow: false
    }
  },
  computed: {
    isCurrent() {
      return { [this.current]: true }
    },
    notShow() {
      return {
        create_from_mnemonic: this.wallet,
        restore_from_mnemonic: this.wallet,
        restore_from_wif: this.wallet,
        restore_from_key_file: this.wallet,
        restore_from_ledger: this.network !== 'mainnet',
        view: this.mode === 'offline' || !this.wallet,
        transactions: this.mode === 'offline' || !this.wallet,
        wallet: this.mode === 'offline' && !this.wallet,
        safe_send: this.mode === 'offline' && !this.wallet,
        send: this.mode === 'offline' || !this.wallet,
        request_payment: !this.wallet,
        dump_as_key_file: !this.wallet || !this.wallet.getHasPrivKey(),
        contract: this.mode === 'offline' || !this.wallet,
        create_token: this.mode === 'offline' || !this.wallet,
        create_contract: this.mode === 'offline' || !this.wallet,
        send_to_contract: this.mode === 'offline' || !this.wallet,
        call_contract: this.mode === 'offline' || !this.wallet,
        create_NFT: this.mode === 'offline' || !this.wallet,
        stake: this.mode === 'offline' || !this.wallet,
        logout: !this.wallet,
        delegation:
          this.mode === 'offline' || !this.wallet || !this.delegationShow
      }
    },
    headerClass() {
      return this.mode === 'normal' ? 'darkgray' : 'deep-purple darken-4'
    }
  },
  watch: {
    async network(newVal) {
      this.delegationShow = false
      await this.onlineDelegation(newVal)
    }
  },
  components: {
    Notify,
    Warning,
    CreateWallet,
    CreateMnemonic,
    RestoreWallet,
    RestoreWif,
    RestoreMobile,
    RestoreKeyFile,
    RestoreLedger,
    ViewWallet,
    ViewTx,
    SafeSend,
    Send,
    RequestPayment,
    DumpKeyFile,
    CreateToken,
    CreateContract,
    SendToContract,
    CallContract,
    Config,
    Delegation,
    CreateNft
  },
  methods: {
    setWallet() {
      this.wallet = webWallet.getWallet()
      this.wallet.init()
      if (this.wallet) {
        if (this.mode === 'offline') {
          this.current = 'request_payment'
        } else {
          this.current = 'view'
        }
      }
    },
    changeView(name) {
      this.current = name
      track.trackAction('change', 'page', name)
      this.drawer = !this.drawer
    },
    reloadPage(){
      window.location.reload()
    },
    error(msg, isHtml = false, ttl = 10) {
      this.addNotify(msg, 'error', isHtml, ttl)
    },
    success(msg, isHtml = false, ttl = 10) {
      this.addNotify(msg, 'success', isHtml, ttl)
    },
    addNotify(msg, type, isHtml = false, ttl = 10) {
      const notifyId = [msg, type].join('_')
      const notify = {
        msg: msg.split(' ').reduce((msg, current) => {
          let tmsg = this.$t('common.notify.' + current)
          tmsg = tmsg === 'common.notify.' + current ? ' ' + current : tmsg
          return msg + tmsg
        }, ''),
        type,
        show: true,
        isHtml
      }
      if (this.notifyList[notifyId] && this.notifyList[notifyId].timer) {
        clearTimeout(this.notifyList[notifyId].timer)
      }
      Vue.set(this.notifyList, notifyId, notify)
      if (ttl > 0) {
        this.notifyList[notifyId].timer = setTimeout(() => {
          Vue.delete(this.notifyList, notifyId)
        }, ttl * 1000)
      }
    },
    async onlineDelegation(network) {
      // 判断代理挖矿功能是否上线
      if (localStorage.getItem(`${network}_delegation_online`)) {
        this.delegationShow = true
      } else {
        let height = 0
        switch (network) {
          case 'testnet':
            height = 1500
            break
          case 'mainnet':
            height = 1500
            break
        }
        // 请求高度
        const res = await onixInfo.getOnixInfo()
        if (res.height > height) {
          localStorage.setItem(`${network}_delegation_online`, true)
          this.delegationShow = true
        }
      }
    }
  },
  mounted() {
    track.track('lan', config.getLan())
    this.onlineDelegation(this.network)
  }
}
</script>
