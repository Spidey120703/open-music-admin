import { ElMessage } from 'element-plus'
import type { VNode } from 'vue'

type Message = string | VNode | (() => VNode)

class Messenger {
  success(msg: Message) {
    ElMessage.success(msg)
  }
  warning(msg: Message) {
    ElMessage.warning(msg)
  }
  error(msg: Message) {
    ElMessage.error(msg)
  }
  info(msg: Message) {
    ElMessage.info(msg)
  }
}

const messenger = new Messenger()

export function useMessage() {
  return messenger
}
