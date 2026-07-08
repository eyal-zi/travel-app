import { useCallback, useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import ToggleButton from '@mui/material/ToggleButton'
import Tooltip from '@mui/material/Tooltip'
import PentagonOutlinedIcon from '@mui/icons-material/PentagonOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { ToolbarGroup, ToolbarRoot } from './MapDrawToolbar.styles'

type DrawMode = 'draw' | 'edit' | 'delete'







export const MapDrawToolbar = () => {
  const map = useMap()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<DrawMode | null>(null)

  
  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    L.DomEvent.disableClickPropagation(node)
    L.DomEvent.disableScrollPropagation(node)
  }, [])

  
  useEffect(() => {
    const sync = () => {
      if (map.pm.globalDrawModeEnabled()) setMode('draw')
      else if (map.pm.globalEditModeEnabled()) setMode('edit')
      else if (map.pm.globalRemovalModeEnabled()) setMode('delete')
      else setMode(null)
    }
    map.on('pm:globaldrawmodetoggled', sync)
    map.on('pm:globaleditmodetoggled', sync)
    map.on('pm:globalremovalmodetoggled', sync)
    return () => {
      map.off('pm:globaldrawmodetoggled', sync)
      map.off('pm:globaleditmodetoggled', sync)
      map.off('pm:globalremovalmodetoggled', sync)
    }
  }, [map])

  const handleMode = useCallback(
    (_: unknown, next: DrawMode | null) => {
      
      if (map.pm.globalDrawModeEnabled()) map.pm.disableDraw()
      if (map.pm.globalEditModeEnabled()) map.pm.disableGlobalEditMode()
      if (map.pm.globalRemovalModeEnabled()) map.pm.disableGlobalRemovalMode()

      if (next === 'draw') map.pm.enableDraw('Polygon')
      else if (next === 'edit') map.pm.enableGlobalEditMode()
      else if (next === 'delete') map.pm.enableGlobalRemovalMode()
    },
    [map],
  )

  return (
    <ToolbarRoot ref={rootRef}>
      <ToolbarGroup orientation="vertical" exclusive value={mode} onChange={handleMode}>
        <ToggleButton value="draw" aria-label="Draw polygon">
          <Tooltip title="Draw polygon" placement="right">
            <PentagonOutlinedIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="edit" aria-label="Edit shapes">
          <Tooltip title="Edit shapes" placement="right">
            <EditOutlinedIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="delete" aria-label="Delete shapes">
          <Tooltip title="Delete shapes" placement="right">
            <DeleteOutlineRoundedIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>
      </ToolbarGroup>
    </ToolbarRoot>
  )
}
