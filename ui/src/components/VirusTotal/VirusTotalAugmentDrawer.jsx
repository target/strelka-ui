import { Drawer, message } from 'antd'
import React, { useState, useEffect } from 'react'
import { APP_CONFIG } from '../../config'
import { useMessageApi } from '../../providers/MessageProvider'
import { fetchWithTimeout } from '../../util'

const VirusTotalAugmentDrawer = ({ resource, onClose, open }) => {
  const [widgetUrl, setWidgetUrl] = useState(null)

  const message = useMessageApi()

  useEffect(() => {
    if (!open) {
      return
    }

    const fetchWidgetUrl = () => {
      const payload = { resource }

      fetchWithTimeout(
        `${APP_CONFIG.BACKEND_URL}/strelka/virustotal/widget-url`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'cors',
          credentials: 'include',
          timeout: APP_CONFIG.API_TIMEOUT,
        },
      )
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(
                errorData.details ||
                  'Error occurred while retrieving VirusTotal widget token',
              )
            })
          }
          return response.json()
        })
        .then((data) => {
          setWidgetUrl(data.widget_url)
        })
        .catch((error) => {
          message.error(`Error retrieving widget token: ${error.message}`)
        })
    }

    fetchWidgetUrl()
  }, [open, resource, message])

  return (
    <Drawer
      title="VirusTotal Augment"
      placement="right"
      closable={true}
      style={{
        zIndex: 5000,
      }}
      styles={{
        body: {
          padding: 10,
        },
      }}
      onClose={onClose}
      open={open}
      width={1000}
    >
      {widgetUrl ? (
        <iframe
          title="VirusTotal Augment"
          src={widgetUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        <p>Loading VirusTotal Augment...</p>
      )}
    </Drawer>
  )
}

export default VirusTotalAugmentDrawer
