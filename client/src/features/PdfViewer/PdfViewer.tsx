import { Frame, ViewerRoot } from './PdfViewer.styles'

export interface PdfViewerProps {
  url: string
  title?: string
}

const hideControls = (url: string) => {
  const [base, hash = ''] = url.split('#')
  const params = new URLSearchParams(hash)
  params.set('toolbar', '0')
  params.set('navpanes', '0')
  return `${base}#${params.toString()}`
}

export const PdfViewer = ({ url, title = 'PDF document' }: PdfViewerProps) => {
  return (
    <ViewerRoot>
      <Frame src={hideControls(url)} title={title}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open {title}
        </a>
      </Frame>
    </ViewerRoot>
  )
}
