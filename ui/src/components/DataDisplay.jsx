import { Typography } from 'antd'
import React from 'react'

const { Text } = Typography

export const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children

export const DataDisplayObj = ({ name, value }) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <div>
        <ConditionalWrapper
          condition={name}
          wrapper={(children) => (
            <span>
              {' '}
              <Text code>{name}</Text> {children}
            </span>
          )}
        >
          <Text>{value}</Text>
        </ConditionalWrapper>
      </div>
    )
  }

  if (typeof value === 'boolean') {
    return (
      <div>
        <ConditionalWrapper
          condition={name}
          wrapper={(children) => (
            <span>
              {' '}
              <Text code>{name}</Text> {children}
            </span>
          )}
        >
          <Text>{value.toString()}</Text>
        </ConditionalWrapper>
      </div>
    )
  }

  if (typeof value === 'object') {
    return (
      <div>
        <ConditionalWrapper
          condition={name}
          wrapper={(children) => (
            <span>
              {' '}
              <Text code>{name}</Text> {children}
            </span>
          )}
        >
          <div style={{ marginLeft: '10px' }}>
            {Object.entries(value).map(([key, val]) => (
              <DataDisplayObj key={key} name={key} value={val} />
            ))}
          </div>
        </ConditionalWrapper>
      </div>
    )
  }

  return null
}
