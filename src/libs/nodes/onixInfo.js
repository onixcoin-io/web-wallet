import axios from 'axios'
import config from '@/libs/config'
// todo change apis to onix.info

let domain = ''
let explorer = ''

switch (config.getNetwork()) {
    case 'testnet':
        domain = 'http://127.0.0.1:7001'
        break
    case 'mainnet':
        domain = 'https://api.onixcoin.io:7001',
        explorer = 'https://info.onixcoin.io:5001'
        break
}
const apiPrefix = domain + ''

const _get = async url => {
    return (await axios.get(apiPrefix + url)).data
}

const _post = async(url, data) => {
    return (await axios.post(apiPrefix + url, data)).data
}

export default {
    async getInfo(address) {
        return await _get(`/address/${address}`)
    },

    async getTokenInfo(contractAddress) {
        return await _get(`/orc20/${contractAddress}`)
    },

    async getTxList(address, size = 10) {
        const res = await _get(`/address/${address}/txs?page=0&pageSize=${size}`)
        return Promise.all(res.transactions.map(tx => _get(`/tx/${tx}`)))
    },

    async getUtxoList(address) {
        return (await _get(`/address/${address}/utxo`)).map(item => {
            return {
                address: item.address,
                txid: item.transactionId,
                confirmations: item.confirmations,
                isStake: item.isStake,
                amount: item.value,
                value: item.value,
                hash: item.transactionId,
                pos: item.outputIndex
            }
        })
    },

    async sendRawTx(rawTx) {
        const res = await _post('/tx/send', `rawtx=${rawTx}`)
        return {
            txId: res.txid,
            message: res.message
        }
    },

    async fetchRawTx(txid) {
        return await _get(`/raw-tx/${txid}`)
    },

    getTxExplorerUrl(tx) {
        return `${explorer}/tx/${tx}`
    },

    getAddrExplorerUrl(addr) {
        return `${explorer}/address/${addr}`
    },

    async callContract(address, encodedData) {
        return (await _get(`/contract/${address}/call/?data=${encodedData}`))
            .executionResult.output
    },

    async getOnixInfo() {
        return await _get('/info')
    }
}
