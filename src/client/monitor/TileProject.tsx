import React from 'react'
import styles from './tile-project.scss'
import {isBlank} from '../common/Utils'
import {formatBuildLabel, isBuilding, Project} from '../domain/Project'
import {VisuallyHidden} from '../common/VisuallyHidden'
import {Duration} from '../common/Duration'
import {Tile} from './Tile'
import {getIdentifier, Tray} from '../domain/Tray'

interface TileProjectProps {
  readonly project: Project;
  readonly tray: Tray;
  readonly showBuildTime?: boolean;
  readonly showTrayName?: boolean;
  readonly showBuildLabel?: boolean;
}

export function TileProject(
  {
    project: {name, stage, prognosis, lastBuildTime, thisBuildTime, lastBuildLabel},
    tray,
    showTrayName,
    showBuildTime,
    showBuildLabel
  }: TileProjectProps
) {
  const building = isBuilding(prognosis)

  const identifier = showTrayName && (
    <span className={styles.identifier}
          data-locator='tray-name'>
      {getIdentifier(tray)}
    </span>
  )

  const time = showBuildTime &&
    <span className={styles.time}>
      <Duration timestamp={building ? thisBuildTime : lastBuildTime}/>
    </span>

  const buildLabel = showBuildLabel && !building && !isBlank(lastBuildLabel) && (
    <div className={styles.buildLabel}
         data-locator='build-label'
         aria-label={`build label ${lastBuildLabel}`}>
      {formatBuildLabel(lastBuildLabel)}
    </div>
  )

  const showAdditionalInfo = showBuildTime || showBuildLabel

  const additional = showAdditionalInfo && (
    <span className={styles.additionalInfo}>
      <VisuallyHidden>prognosis {prognosis}</VisuallyHidden>
      {time || <div aria-hidden={true}>&nbsp;</div>}
      {buildLabel}
    </span>
  )

  return (
    <Tile header={identifier}
          footer={additional}
          className={styles[prognosis]}>
      {name} {stage}
    </Tile>
  )
}