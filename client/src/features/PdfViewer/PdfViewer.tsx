import { Frame, ViewerRoot } from './PdfViewer.styles'

export interface PdfViewerProps {
  url: string
  title?: string
}

export const PdfViewer = ({ url, title = 'PDF document' }: PdfViewerProps) => {
  return (
    <ViewerRoot>
      <Frame src={url} title={title}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open {title}
        </a>
      </Frame>
    </ViewerRoot>
  )
}
