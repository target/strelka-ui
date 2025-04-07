import { UnorderedListOutlined } from '@ant-design/icons'
import { Panel } from '@xyflow/react'
import { Button, Drawer } from 'antd'
import { useState } from 'react'
import FileListingSidebar from './FileListingSidebar'

function ShowFileListing({ nodes }) {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible)
  }

  return (
    <>
      <Panel position="top-right" style={{ marginTop: '55px' }}>
        <Button
          type="primary"
          icon={<UnorderedListOutlined />}
          onClick={toggleDrawer}
          style={{ minWidth: '165px' }}
        >
          Show File Listing
        </Button>
      </Panel>
      <Drawer
        title="File Listing"
        placement="right"
        closable={true}
        onClose={toggleDrawer}
        open={isDrawerVisible}
        width={500}
      >
        <FileListingSidebar nodes={nodes} />
      </Drawer>
    </>
  )
}

export default ShowFileListing
