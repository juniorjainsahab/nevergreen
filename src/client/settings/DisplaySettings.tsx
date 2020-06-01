import React, {ReactElement} from 'react'
import {Container} from '../common/Container'
import {Checkbox} from '../common/forms/Checkbox'
import {DropDown} from '../common/forms/DropDown'
import styles from './display-settings.scss'
import {DisplayPrognosisSelection} from './DisplayPrognosisSelection'
import {useDispatch, useSelector} from 'react-redux'
import {
  setMaxProjectsToShow,
  setShowBuildLabel,
  setShowBuildTime,
  setShowTrayName,
  setSort
} from './SettingsActionCreators'
import {
  getMaxProjectsToShow,
  getShowBuildLabel,
  getShowBuildTime,
  getShowTrayName,
  getSort,
  MaxProjectsToShow
} from './SettingsReducer'
import {SortBy} from '../gateways/ProjectsGateway'
import {Link} from 'react-router-dom'

export function DisplaySettings(): ReactElement {
  const dispatch = useDispatch()
  const showTrayName = useSelector(getShowTrayName)
  const showBuildTime = useSelector(getShowBuildTime)
  const showBuildLabel = useSelector(getShowBuildLabel)
  const maxProjectsToShow = useSelector(getMaxProjectsToShow)
  const sort = useSelector(getSort)

  const projectsToShowOptions = [
    {value: MaxProjectsToShow.focused, display: 'Focused'},
    {value: MaxProjectsToShow.balanced, display: 'Balanced'},
    {value: MaxProjectsToShow.intense, display: 'Intense'},
    {value: MaxProjectsToShow.everything, display: 'Everything (not recommended)'}
  ]

  const sortOptions = [
    {value: SortBy.default, display: 'Default'},
    {value: SortBy.description, display: 'Description'},
    {value: SortBy.prognosis, display: 'Prognosis'},
    {value: SortBy.timestamp, display: 'Timestamp'}
  ]

  return (
    <Container title='Display' className={styles.container}>
      <Checkbox className={styles.showTrayName}
                checked={showTrayName}
                onToggle={(newValue) => dispatch(setShowTrayName(newValue))}
                data-locator='show-tray-names'>
        Show feed identifier
      </Checkbox>
      <Checkbox className={styles.checkbox}
                checked={showBuildTime}
                onToggle={(newValue) => dispatch(setShowBuildTime(newValue))}
                data-locator='show-build-times'>
        Show build time
      </Checkbox>
      <Checkbox className={styles.checkbox}
                checked={showBuildLabel}
                onToggle={(newValue) => dispatch(setShowBuildLabel(newValue))}
                data-locator='show-build-labels'>
        Show build label
      </Checkbox>

      <DisplayPrognosisSelection/>

      <DropDown className={styles.dropDown}
                options={projectsToShowOptions}
                value={maxProjectsToShow}
                onChange={({target}) => dispatch(setMaxProjectsToShow(target.value as MaxProjectsToShow))}
                data-locator='max-projects-to-show'>
        <span className={styles.dropDownLabel}>Amount of project to show</span>
      </DropDown>

      <DropDown className={styles.dropDown}
                options={sortOptions}
                value={sort}
                onChange={({target}) => dispatch(setSort(target.value as SortBy))}
                data-locator='sort-projects-by'>
        <span className={styles.dropDownLabel}>Sort projects by</span>
      </DropDown>

      <Link to='/preview'
            className={styles.preview}
            data-locator='display-preview'>
        Preview display
      </Link>
    </Container>
  )
}
