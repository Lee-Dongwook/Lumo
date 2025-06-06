import React from 'react'
import { useI18n } from './i18n-provider'
import { TranslationOptions } from './i18n-config'
import { CustomText } from 'app/design/typography'

export type ComponentTrans = {
  Component: any
  props?: {
    className: string
  }
}

type Props = {
  components: ComponentTrans[]
  iKey: string
  options?: TranslationOptions
  className?: string
}

const Trans = (props: Props) => {
  const { components, iKey, options, className } = props
  const { t } = useI18n()
  const message = t(iKey, options)
  const row = React.useMemo(() => {
    const nodes: any[] = []
    let messageToParse = message
    components.forEach(({ Component: Component, props }, index) => {
      const componentRegExp = new RegExp(`<${index}>(.*)</${index}>`, 'gi')
      const [beforeText, componentText, restText] =
        messageToParse.split(componentRegExp)
      messageToParse = restText || ''
      nodes.push(
        beforeText,
        <Component key={index} className={props?.className}>
          {componentText}
        </Component>,
      )
    })
    nodes.push(
      <CustomText
        className={className}
        key={messageToParse}
        id={messageToParse}
      >
        {messageToParse}
      </CustomText>,
    )
    return nodes
  }, [message, components])
  return <>{row}</>
}

export default Trans
