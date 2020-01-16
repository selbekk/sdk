// @flow
export type TransportMode =
    | 'air'
    | 'bus'
    | 'cableway'
    | 'coach'
    | 'funicular'
    | 'lift'
    | 'metro'
    | 'rail'
    | 'tram'
    | 'unknown'
    | 'water'

// All valid values for the "mode" parameter to JourneyPlanner
export type QueryMode =
    | 'air'
    | 'bicycle'
    | 'bus'
    | 'cableway'
    | 'car'
    | 'car_dropoff'
    | 'car_park'
    | 'car_pickup'
    | 'coach'
    | 'foot'
    | 'funicular'
    | 'lift'
    | 'metro'
    | 'rail'
    | 'tram'
    | 'transit'
    | 'water'

export type LegMode =
    | TransportMode
    | 'bicycle'
    | 'car'
    | 'foot'

export type TransportSubmode =
    | 'localBus'
    | 'regionalBus'
    | 'expressBus'
    | 'nightBus'
    | 'sightseeingBus'
    | 'shuttleBus'
    | 'schoolBus'
    | 'railReplacementBus'
    | 'airportLinkBus'
    | 'internationalCoach'
    | 'nationalCoach'
    | 'localTram'
    | 'cityTram'
    | 'metro'
    | 'local'
    | 'regionalRail'
    | 'interregionalRail'
    | 'longDistance'
    | 'international'
    | 'touristRailway'
    | 'nightRail'
    | 'internationalCarFerry'
    | 'nationalCarFerry'
    | 'localCarFerry'
    | 'internationalPassengerFerry'
    | 'localPassengerFerry'
    | 'sightseeingService'
    | 'highSpeedVehicleService'
    | 'highSpeedPassengerService'
    | 'internationalFlight'
    | 'domesticFlight'
    | 'helicopterService'
    | 'telecabin'
    | 'funicular'
