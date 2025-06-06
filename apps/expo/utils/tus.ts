import { Upload } from 'tus-js-client'
import * as ImagePicker from 'expo-image-picker'

function getFileExtension(uri: string): string {
  const match = /\.([a-zA-Z]+)$/.exec(uri)
  if (match !== null) {
    return match[1] as string
  }

  return ''
}

function getMimeType(extension: string): string {
  if (extension === 'jpg') return 'image/jpeg'
  return `image/${extension}`
}

export async function uploadFiles(
  bucketName: string,
  pickerResult: ImagePicker.ImagePickerResult,
) {
  if (!pickerResult || !pickerResult.assets) return
  const allUploads = pickerResult.assets.map(
    (file: ImagePicker.ImagePickerAsset) => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise<string>(async (resolve, reject) => {
        const extension = getFileExtension(file.uri)
        const blob = await fetch(file.uri).then((res) => res.blob())
        const fileName = file?.fileName ?? `${Date.now()}.${extension}`

        let upload = new Upload(blob, {
          endpoint: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
            'x-upsert': 'true',
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: bucketName,
            objectName: fileName,
            contentType: getMimeType(extension),
            cacheControl: '3600',
          },
          chunkSize: 6 * 1024 * 1024,
          onError: function (error) {
            console.error('Upload error details:', {
              error,
              endpoint: upload.options.endpoint,
              bucketName,
              headers: upload.options.headers,
            })
            reject(error)
          },
          onProgress: function (bytesUploaded, bytesTotal) {
            var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + '%')
          },
          onSuccess: function () {
            console.log('Uploaded %s', upload.options.metadata!.objectName)
            const publicUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${fileName}`
            resolve(publicUrl)
          },
        })

        return upload.findPreviousUploads().then(function (previousUploads) {
          if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0]!)
          }
          upload.start()
        })
      })
    },
  )

  const results = await Promise.allSettled(allUploads)
  const successfulUploads = results
    .filter(
      (result): result is PromiseFulfilledResult<string> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value)

  return successfulUploads[0]
}
