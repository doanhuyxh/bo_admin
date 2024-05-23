import { toDataURL } from '../../../../helper/common'
import Uppy from '@uppy/core'
import thumbnailGenerator from '@uppy/thumbnail-generator'
import { DragDrop } from '@uppy/react'
import { Card, CardBody } from 'reactstrap'

const FileUploaderBasic = ({ setPreviewArr, previewArr, isDelete, disabled }) => {


  const uppy = new Uppy({
    meta: { type: 'avatar' },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true
  })

  uppy.use(thumbnailGenerator)

  uppy.on('thumbnail:generated', (file, preview) => {
    toDataURL(
      preview,
      (dataUrl) => {
        const newItem = {
          booksImageUrl: dataUrl,
          isChange: true
        }
        setPreviewArr([newItem])
      }
    )
  })

  const renderPreview = () => {
    if (previewArr.length) {
      return previewArr.map((item, index) => <div className='rounded mt-2 mr-1' style={{ position: "relative", float: 'left' }}>
        
         <a href={item.booksImageUrl} target="_blank">
         <img key={index} style={{ maxWidth: "100%", maxHeight: "170px" }} src={item.booksImageUrl} alt='avatar' /> 
         </a>
         {
           isDelete? (
            <div className="deleteImage" onClick={() => {
              const newData = previewArr.filter((_, index2) => index2 !== index)
              setPreviewArr([...newData])
            }}>X</div>
           ):null
         }
        </div>)
    } else {
      return null
    }
  }
  return (
    <Card>

      <CardBody>
        {
          disabled? null :  <DragDrop disabled={disabled} uppy={uppy} />
        }
       
        {renderPreview()}
      </CardBody>
    </Card>
  )
}

export default FileUploaderBasic
