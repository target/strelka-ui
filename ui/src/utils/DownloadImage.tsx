import { PictureOutlined } from '@ant-design/icons'
import { Panel, getViewportForBounds, useReactFlow } from '@xyflow/react'
import { Button } from 'antd'
import { toPng } from 'html-to-image'

function downloadImage(dataUrl: string) {
  const a = document.createElement('a')

  a.setAttribute('download', 'reactflow.png')
  a.setAttribute('href', dataUrl)
  a.click()
}

const imageWidth = 3840
const imageHeight = 2160

function DownloadImage() {
  const { getNodes, getNodesBounds } = useReactFlow()
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getNodesBounds(getNodes())
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5, // min Zoom
      2, // maxZ oom
      0.1, // padding - need this set to avoid NaN bug in getViewportForBounds
    )

    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      width: imageWidth,
      height: imageHeight,
      style: {
        width: String(imageWidth),
        height: String(imageHeight),
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(downloadImage)
  }

  return (
    <Panel position="top-right">
      <Button
        type="primary"
        style={{ minWidth: '165px' }}
        icon={<PictureOutlined />}
        onClick={onClick}
      >
        Download Flow
      </Button>
    </Panel>
  )
}

export default DownloadImage
