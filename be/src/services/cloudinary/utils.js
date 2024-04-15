import { FILE_URL_RULE } from '../../utilities/regex'


/**
 * Regex này dùng để tách phần directory + filename ra khỏi url, chỗ tách sẽ là ở /v.*?/ trong url.
 * VD: URL = "http://res.cloudinary.com/dbtb0sjby/image/upload/v1687161128/images/blogs/ee94b1vx4vr4vwddu2rt.jpg"
 * -> Tách ở /v.*?/ = /v1687161128/
 * -> Từ đó mình có được một mảng gồm: ["http://res.cloudinary.com/dbtb0sjby/image/upload", "images/blogs/ee94b1vx4vr4vwddu2rt.jpg"]
 */
let pathNameRegex = /\/v\d*?\//
/**
 * Regex này dùng để lấy full file name
 * VD: Đầu tiên mình tách ra được là "images/blogs/ee94b1vx4vr4vwddu2rt.jpg", khi run match() với regex này thì mình sẽ nhận được một mảng
 * ["images/blogs/ee94b1vx4vr4vwddu2rt.jpg", "ee94b1vx4vr4vwddu2rt.jpg"]
 * Từ đây lấy ra được `fullFileName` lẫn `publicId` (Xem thêm ở phần return)
 */
let fileNameReg = /.*?\/(\w+\.\w+)/
let resourceTypesRegex = /(image)|(video)|(raw)|(auto)/g

/**
 * Hàm này dùng để lấy `fullFileName`, `publicId` và `resourceType` của một file từ url của file đó.
 *
 * Ví dụ: URL = `http://res.cloudinary.com/dbtb0sjby/image/upload/v1687161128/images/blogs/ee94b1vx4vr4vwddu2rt.jpg`
 * ```
 * return {
 *   fullFileName: "ee94b1vx4vr4vwddu2rt.jpg",
 *   publicId: "images/blogs/ee94b1vx4vr4vwddu2rt"
 * }
 * ```
 */
function getResourceInformation(resourceUrl) {
  try {
    if (!FILE_URL_RULE.test(resourceUrl)) throw new Error('This resource\'s url is not valid.')
    let results = resourceUrl.split(pathNameRegex)[1].match(fileNameReg)
    let resourceTypeResult = resourceUrl.match(resourceTypesRegex)

    if (results) {
      return {
        fullFileName: results[1],
        publicId: results[0].split('.')[0],
        resourceType: resourceTypeResult[0]
      }
    }
  } catch (error) {
    return undefined
  }
}

/**
 * Dùng để lấy nhiều `public_id` trong các url của resources.
 * @param {Array<string>} resourceUrls một mảng các url của resource trên Cloudinary
 * @returns
 */
function getResourcesInformation(resourceUrls) {
  try {
    let results = resourceUrls.map(resourceUrl => getResourceInformation(resourceUrl))
    return results
  } catch (error) {
    return undefined
  }
}

export const CloudinaryUtils = {
  getResourceInformation,
  getResourcesInformation
}