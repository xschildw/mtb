import AdherenceService from '@services/adherence.service'
import {AdherenceByDayEntries, AdherenceWeeklyReport, SessionDisplayInfo} from '@typedefs/types'
import _ from 'lodash'

import dayjs from 'dayjs'
import advanced from 'dayjs/plugin/advancedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advanced)

function getMaxNumberOfTimeWindows(streams: (AdherenceParticipantReportWeek | AdherenceWeeklyReport)[]): number {
  const maxNumberOfWindowsInStreams = streams.map(stream => {
    const dayEntires = _.flatten(Object.values(stream.byDayEntries))
    const maxWindowsInStream = Math.max(...dayEntires.map(entry => entry.timeWindows.length))
    return maxWindowsInStream
  })

  return Math.max(...maxNumberOfWindowsInStreams)
}
/*
// agendel: seems like this is retruned by the server
function getLastSchedleDate(
  streams: (AdherenceParticipantReportWeek | AdherenceWeeklyReport)[]
): string {
  const maxNumberOfWindowsInStreams = streams.map(stream => {
    const dayEntires = _.flatten(Object.values(stream.byDayEntries))
    const windowEndDates = _.flatten(
      dayEntires.map(entry => entry.timeWindows.map(tw => tw.endDate))
    )
    const latestWindow = _.last(windowEndDates.sort()) || ''
    return latestWindow
  })

  var result = _.last(maxNumberOfWindowsInStreams.sort()) || ''
  return new Date(result).toDateString()
}*/
function isCompliant(adherence: number | undefined): boolean {
  return adherence === undefined || adherence > AdherenceService.COMPLIANCE_THRESHOLD
}

function getDisplayFromLabel(
  label: string,
  burstNumber: number | undefined,
  isReturnArray?: boolean
): string | string[] {
  const arr = label.split('/')
  const returnLabel =
    burstNumber !== undefined ? `${arr[1].trim()} / Burst ${burstNumber}` : `${arr[1].trim()} / ${arr[0].trim()}`

  return isReturnArray ? returnLabel.split('/') : returnLabel
}

function getUniqueSessionsInfo(
  items: AdherenceWeeklyReport[] | AdherenceParticipantReportWeek[]
): SessionDisplayInfo[] {
  const labels = _.flatten(items.map(i => i.rows))
  const result: SessionDisplayInfo[] = labels
    .filter(label => !!label)
    .map(label => ({
      sessionGuid: label.sessionGuid,
      sessionName: label.sessionName,
      sessionSymbol: label.sessionSymbol,
    }))

  return _.uniqBy(result, 'sessionGuid')
}

function getDateForDisplay(date: string | undefined, emptyText: string = 'Event date is not defined') {
  return date ? dayjs(date).format('MM/DD/YYYY') : emptyText
}

function getTimeForDisplay(time: string | undefined | null, atSymbol: boolean = true) {
  const localTz = dayjs.tz.guess()
  return time ? `${atSymbol ? ' @ ' : ''} ${dayjs(time, 'HH:mm').tz(localTz).format('h:mma z')}` : ''
}

function getDateTimeForDisplay(datetime: string | undefined) {
  const localTz = dayjs.tz.guess()

  if (!datetime) {
    return ''
  }
  const converted = dayjs(datetime).tz(localTz).format('MM/DD/YY h:mm A z')
  return converted
}

function getItemFromByDayEntries(byDayEntries: AdherenceByDayEntries, dayIndex: number, rowIndex: number) {
  return byDayEntries[dayIndex][rowIndex]
}

const AdherenceUtility = {
  getMaxNumberOfTimeWindows,
  getUniqueSessionsInfo,
  getDateForDisplay,
  getDateTimeForDisplay,
  getTimeForDisplay,
  isCompliant,
  getDisplayFromLabel,
  getItemFromByDayEntries,
}

export default AdherenceUtility
