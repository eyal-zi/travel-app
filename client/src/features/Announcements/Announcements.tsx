import { useAnnouncements } from './queries/useAnnouncements'
import { AnnouncementsList } from './components/AnnouncementsList/AnnouncementsList'
import { AnnouncementComposer } from './components/AnnouncementComposer/AnnouncementComposer'
import { Root } from './Announcements.styles'

export const Announcements = () => {
  const {
    items,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    add,
    isPosting,
    postError,
    resetPostError,
  } = useAnnouncements()

  return (
    <Root>
      <AnnouncementsList
        items={items}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
      <AnnouncementComposer
        onSend={add}
        isPosting={isPosting}
        postError={postError}
        resetPostError={resetPostError}
      />
    </Root>
  )
}
