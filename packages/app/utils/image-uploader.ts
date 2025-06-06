import { createClient } from '@supabase/supabase-js'

interface ImageUploadProps {
  file: any
  bucketName: string
  path: string
  fileName?: string
  isUpdate?: boolean
}

const imageUploader = async ({
  file,
  bucketName,
  path,
  fileName,
  isUpdate = false,
}: ImageUploadProps) => {
  try {
    const { storage } = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const filePath = `${path}/${fileName}`

    if (isUpdate) {
      await storage.from(bucketName).upload(filePath, file, {
        contentType: 'image/png',
        cacheControl: '0',
        upsert: true,
      })
    } else {
      await storage.from(bucketName).upload(filePath, file, {
        contentType: 'image/png',
        cacheControl: '0',
      })
    }

    const publicUrl = storage.from(bucketName).getPublicUrl(filePath)
      .data.publicUrl
    return `${publicUrl}?t=${Date.now()}`
  } catch (error) {
    console.error(`Error ${[bucketName]} uploading file:`, error)
    throw error
  }
}

export { imageUploader }
