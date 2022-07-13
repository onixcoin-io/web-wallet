import insight from '@/libs/nodes/insight'
import onixInfo from '@/libs/nodes/onixInfo'

let nodeConfigs = {
    insight,
    onixInfo
}

const defaultNodeId = 'onixInfo'
let currentNodeId = defaultNodeId

export default {
    currentNode() {
        return nodeConfigs[currentNodeId]
    },

    setNodeId(nodeId) {
        if (nodeConfigs[nodeId]) {
            currentNodeId = nodeId
        }
    }
}
