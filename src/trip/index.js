// @flow
import { journeyPlannerQuery } from '../api'
import {
    FOOT, BUS, TRAM, RAIL, METRO, WATER, AIR,
} from '../constants/travelModes'

import {
    getTripPatternQuery,
    getDeparturesForStopPlacesQuery,
    getDeparturesForQuayQuery,
} from './query'

import { legMapper } from './mapper'

import type {
    TripPattern,
    Location,
    LegMode,
    TransportSubmode,
} from '../../flow-types'
import type { StopPlaceDepartures, QuayDepartures, Departure } from '../../flow-types/Departures'
import { convertFeatureToLocation, isValidDate } from '../utils'

export type GetTripPatternsParams = {
    searchDate?: Date,
    arriveBy?: boolean,
    modes?: Array<LegMode>,
    transportSubmode?: Array<TransportSubmode>,
    limit?: number,
    wheelchairAccessible?: boolean,
}

const DEFAULT_GET_TRIP_PATTERN_IGNORE_FIELDS = [
    'notices',
    'situations',
    'journeyPattern',
    'fromEstimatedCall',
    'toEstimatedCall',
    'intermediateEstimatedCalls',
    'pointsOnLink',
    'authority',
    'operator',
    'quay',
]

export function getTripPatterns(
    from: Location,
    to: Location,
    params?: GetTripPatternsParams = {},
    ignoreFields?: Array<string> = DEFAULT_GET_TRIP_PATTERN_IGNORE_FIELDS,
): Promise<Array<TripPattern>> {
    const {
        searchDate = new Date(),
        arriveBy = false,
        modes = [FOOT, BUS, TRAM, RAIL, METRO, WATER, AIR],
        transportSubmode = [],
        wheelchairAccessible = false,
        limit = 5,
        ...rest
    } = params

    const variables = {
        from,
        to,
        dateTime: searchDate.toISOString(),
        arriveBy,
        modes,
        transportSubmode,
        wheelchair: wheelchairAccessible,
        numTripPatterns: limit,
        ...rest,
    }

    return journeyPlannerQuery(getTripPatternQuery, variables, ignoreFields, this.config)
        .then((data: Object = {}) => {
            if (!data?.trip?.tripPatterns) {
                return []
            }

            return data.trip.tripPatterns.map(trip => ({
                ...trip,
                legs: trip.legs.map(legMapper),
            }))
        })
}

export async function findTrips(
    from: string,
    to: string,
    date?: Date | string | number,
): Promise<Array<TripPattern>> {
    const searchDate = date ? new Date(date) : new Date()

    if (!isValidDate(searchDate)) {
        throw new Error('Entur SDK: Could not parse <date> argument to valid Date')
    }

    const [fromFeatures, toFeatures] = await Promise.all([
        this.getFeatures(from),
        this.getFeatures(to),
    ])

    if (!fromFeatures || !fromFeatures.length) {
        throw new Error(`Entur SDK: Could not find any locations matching <from> argument "${from}"`)
    }

    if (!toFeatures || !toFeatures.length) {
        throw new Error(`Entur SDK: Could not find any locations matching <to> argument "${to}"`)
    }

    return this.getTripPatterns(
        convertFeatureToLocation(fromFeatures[0]),
        convertFeatureToLocation(toFeatures[0]),
        searchDate,
    )
}

type EstimatedCallParams = {
    includeNonBoarding?: boolean,
    limit?: number,
    departures?: number, // deprecated
    timeRange?: number,
}
export function getDeparturesForStopPlaces(
    stopPlaceIds: Array<string>,
    params?: EstimatedCallParams = {},
): Promise<Array<StopPlaceDepartures>> {
    const {
        limit = 50,
        departures,
        timeRange = 72000,
        includeNonBoarding = false,
        ...rest
    } = params

    if (departures !== undefined) {
        // eslint-disable-next-line no-console
        console.info('Entur SDK: "departures" is deprecated, use "limit" instead.')
    }

    const variables = {
        ids: stopPlaceIds,
        start: new Date().toISOString(),
        omitNonBoarding: !includeNonBoarding,
        timeRange,
        limit: departures || limit,
        ...rest,
    }

    return journeyPlannerQuery(getDeparturesForStopPlacesQuery, variables, undefined, this.config)
        .then((data: Object = {}) => data?.stopPlaces || [])
}

export function getDeparturesForStopPlace(
    stopPlaceId: string,
    params?: EstimatedCallParams,
): Promise<Array<Departure>> {
    return getDeparturesForStopPlaces.call(this, [stopPlaceId], params)
        .then((stopPlaces: Array<StopPlaceDepartures>) => stopPlaces?.[0]?.estimatedCalls || [])
}

export function getDeparturesForQuays(
    quayIds: Array<string>,
    params?: EstimatedCallParams = {},
): Promise<Array<QuayDepartures>> {
    const {
        limit = 30,
        timeRange = 72000,
        includeNonBoarding = false,
        ...rest
    } = params

    const variables = {
        ids: quayIds,
        start: new Date().toISOString(),
        omitNonBoarding: !includeNonBoarding,
        timeRange,
        limit,
        ...rest,
    }
    return journeyPlannerQuery(getDeparturesForQuayQuery, variables, undefined, this.config)
        .then((data: Object = {}) => data?.quays || [])
}

export function getStopPlaceDeparturesDEPRECATED() {
    throw new Error('Entur SDK: "getStopPlaceDepartures" is deprecated, use "getDeparturesForStopPlace" or getDeparturesForStopPlaces instead.')
}
