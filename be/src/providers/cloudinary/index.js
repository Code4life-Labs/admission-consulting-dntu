import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import fs from 'fs'
import { rejects } from 'assert'
import { env } from '../../config/environment'
import { convertToSlug } from '~/utilities/func'

/**
 * Tài liệu tham khảo:
 * https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
 * https://andela.com/insights/how-to-use-cloudinary-and-nodejs-to-upload-multiple-images/
 */

// https://www.npmjs.com/package/cloudinary

const cloudinaryV2 = cloudinary.v2

cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

export const uploadFilePdf = async (folderName) => {
  const byteArrayBuffer = fs.readFileSync(`src/documents/pdf/${folderName}.pdf`)
  // await deleteFolder(`PdfImages/${folderName}`)
  // const slugFolderName = convertToSlug(folderName)
  const promiseHandle = () => {
    return new Promise((resolve) => {
      cloudinary.v2.uploader.upload_stream( {
        // folder: `Pdf/${slugFolderName}`,
        folder: 'Pdf',
        //để auto cloudinary tự động nhận file
        resource_type: 'auto'
      }, (error, uploadResult) => {
        if (error) rejects(error)
        return resolve({
          url: uploadResult.url,
          id: uploadResult.asset_id
        })
      }).end(byteArrayBuffer)
    })
  }
  const result = await promiseHandle()
  return result
}

export const deleteFolder = async (folderName) => {
  // delete folder existing
  await cloudinaryV2.api
    .delete_resources_by_prefix(folderName)
    .then(result => console.log('result delete folder:', folderName))
    .catch(err => console.log(err))
}

export async function streamUploadMutiple(fileBuffers, options) {
  // options = Object.assign(
  //   {
  //     folder: ''
  //   },
  //   options
  // )

  const uploadPromises = fileBuffers.map((fileBuffer) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinaryV2.uploader.upload_stream(
        options,
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            const vocab = {
              origin_file_name: fileBuffer.origin_file_name,
              url: result?.url
            }
            resolve(vocab)
          }
        }
      )

      streamifier.createReadStream(fileBuffer.buffer).pipe(stream)
    })
  })
  // Đây là tiến trinh song song => giảm được thời gian chờ
  const results = await Promise.all(uploadPromises)
  if (results) return results
  else return []
}
