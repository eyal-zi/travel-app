import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { AdminPageShell } from '../../common/components/AdminPageShell/AdminPageShell'
import { useTabParam } from '../../common/hooks/useTabParam'
import { LargeFileSearch } from '../LargeFileRequest/components/LargeFileSearch/LargeFileSearch'
import { FileRequestsList } from './components/FileRequestsList/FileRequestsList'







type TabValue = 'requests' | 'search'

export const FileRequestAdminPage = () => {
  const [tab, setTab] = useTabParam(['requests', 'search'] as const, 'requests')

  return (
    <AdminPageShell
      title="File request admin"
      subtitle="Review incoming file requests, respond and attach files."
      maxWidth={1680}
    >
      <Tabs value={tab} onChange={(_event, value: TabValue) => setTab(value)}>
        <Tab value="requests" label="File requests" />
        <Tab value="search" label="Search files" />
      </Tabs>

      {tab === 'requests' && <FileRequestsList admin />}
      {tab === 'search' && <LargeFileSearch />}
    </AdminPageShell>
  )
}
