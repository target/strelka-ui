import { message } from 'antd'
import { createContext, useContext } from 'react'

import type { MessageInstance } from 'antd/es/message/interface'

interface MessageContext {
  messageApi: MessageInstance
}

const MessageCtx = createContext<MessageContext | undefined>(undefined)

/**
 * Custom hook to access the message API from the Message context.
 *
 * @returns {MessageInstance} The message API instance from the context.
 */
export function useMessageApi(): MessageInstance {
  const ctx = useContext(MessageCtx)

  if (!ctx) {
    throw new Error('useMessageApi must be used within a MessageProvider')
  }

  return ctx.messageApi
}

export const MessageProvider = (props) => {
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <>
      {contextHolder}
      <MessageCtx.Provider value={{ messageApi }} {...props} />
    </>
  )
}
