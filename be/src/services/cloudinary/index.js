import cloudinary from 'cloudinary'
import path from 'path'
import fs from 'fs'


import { CloudinaryUtils } from './utils'
import { env } from '../../config/environment'


const cloudinaryV2 = cloudinary.v2

// Configure cloudinary
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

/**
 * Use to upload a temp file in folder `uploads`. After upload processing is done, the temp file in `uploads` will be deleted.
 * Limit size of upload file is 5 mb.
 * @param file
 * @param options
 * @returns
 */
async function uploadAsync(file, options, fsCB) {
  // let filePath = path.resolve(environments.UPLOAD_PATHS.ROOT, file)
  let uploadResponse = cloudinaryV2.uploader.upload(
    file,
    options,
    function (err, result) {
      if (!err) {
        let cb = fsCB ? fsCB : (err) => { if (err) throw err }
        // fs.unlink(file, cb)
      }
    }
  )
  return uploadResponse
}

/**
 * Use to upload temp files in folder `uploads`. After upload processing is done, the temp file in `uploads` will be deleted.
 * Limit size of upload files is 5 mb.
 * @param fileInfors
 * @param options
 * @returns
 */
async function uploadMultipleAsync(fileInfors, options) {
  const promises = []
  for (let fileInfor of fileInfors) {
    let name
    let opts
    if (typeof fileInfor === 'string') {
      name = fileInfor
      opts = options
    } else {
      name = fileInfor.name
      opts = Object.assign({}, options, fileInfor.options)
    }
    promises.push(uploadAsync(name, opts))
  }
  return Promise.all(promises)
}

/**
 * Use to delete a resource in cloud by its `url`.
 * @param url
 */
async function deleteAsync(url) {
  let info = CloudinaryUtils.getResourceInformation(url)

  if (!info) throw new Error('Invalid url of resouce.')

  return cloudinaryV2.api.delete_resources([info.publicId])
}

/**
 * Use to delete resources from cloud by their `url`.
 * @param urls
 * @returns
 */
async function deleteMultipleAsync(urls) {
  let promises = []

  for (let url of urls) {
    promises.push(deleteAsync(url))
  }

  return Promise.all(promises)
}

export const CloudinaryService = {
  uploadAsync,
  deleteAsync,
  uploadMultipleAsync,
  deleteMultipleAsync
}