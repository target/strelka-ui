interface ConditionalWrapperOpts {
  condition: boolean
  wrapper: (children: React.ReactNode) => React.ReactNode
  children: React.ReactNode
}

const ConditionalWrapper = (opts: ConditionalWrapperOpts) => {
  const { condition, wrapper, children } = opts
  return condition ? wrapper(children) : children
}

export default ConditionalWrapper
