import { useAnnouncements } from './queries/useAnnouncements'
import { AnnouncementsList } from './components/AnnouncementsList/AnnouncementsList'
import { AnnouncementComposer } from './components/AnnouncementComposer/AnnouncementComposer'
import { useIsAdmin } from '../Auth/useIsAdmin'
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
  const canPost = useIsAdmin()

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
      {canPost && (
        <AnnouncementComposer
          onSend={add}
          isPosting={isPosting}
          postError={postError}
          resetPostError={resetPostError}
        />
      )}
    </Root>
  )
}
