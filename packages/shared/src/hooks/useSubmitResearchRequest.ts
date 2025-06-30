import { useAppMutation } from './useAppMutation'

type SubmitResearchInput =
  | { type: 'file'; file: File; fileType: string }
  | { type: 'url'; url: string }
  | { type: 'keyword'; keyword: string }

type ResearchResponse = {
  result: any // 서버 응답에 따라 구체화 가능
}

export const useSubmitResearchRequest = () =>
  useAppMutation<ResearchResponse, Error, SubmitResearchInput>(
    async (input) => {
      let res: Response

      if (input.type === 'file') {
        const formData = new FormData()
        formData.append('file', input.file)
        formData.append('file_type', input.fileType)
        res = await fetch('/api/analyze/file', {
          method: 'POST',
          body: formData,
        })
      } else if (input.type === 'url') {
        const formData = new FormData()
        formData.append('url', input.url)

        res = await fetch('/api/analyze/url', {
          method: 'POST',
          body: formData,
        })
      } else if (input.type === 'keyword') {
        const formData = new FormData()
        formData.append('keyword', input.keyword)

        res = await fetch('/api/analyze/keyword', {
          method: 'POST',
          body: formData,
        })
      } else {
        throw new Error('잘못된 요청 타입입니다.')
      }

      if (!res.ok) throw new Error('리서치 요청 실패')
      return res.json()
    },
  )
