import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

const convertImg2Base64 = async (
  pickerResult: ImagePicker.ImagePickerResult,
) => {
  if (!pickerResult.canceled && pickerResult.assets[0]) {
    const imageUri = pickerResult.assets[0].uri
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    })
    return base64Image
  }
  return null
}
