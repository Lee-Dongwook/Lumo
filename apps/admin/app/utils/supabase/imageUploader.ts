import { createClient } from '@/utils/supabase/client'

interface ImageUploaderProps {
  file: File
  bucketName: string
  path: string
}

const imageUploader = async ({
  file,
  bucketName,
  path,
}: ImageUploaderProps) => {
  try {
    const { storage } = createClient()

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${path}/${fileName}`

    await storage.from(bucketName).upload(filePath, file)

    return storage.from(bucketName).getPublicUrl(filePath).data.publicUrl
  } catch (error) {
    console.error(`Error ${[bucketName]} uploading file:`, error)
    throw error
  }
}

export { imageUploader }
