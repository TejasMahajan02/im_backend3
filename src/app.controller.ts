import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Country, State, City } from 'country-state-city';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('countries')
  getAllCountries(): object {
    return Country.getAllCountries();
  }

  @Get('states')
  getAllStates(
    @Query('countryCode') countryCode: string,
  ): object {
    if (!countryCode) {
      throw new NotFoundException('Country code must be provided');
    }

    const statesOfCountry = State.getStatesOfCountry(countryCode);

    if (statesOfCountry.length === 0) {
      throw new NotFoundException('No states found for the provided country code');
    }

    return statesOfCountry;
  }

  @Get('cities')
  getAllCities(
    @Query('countryCode') countryCode: string,
    @Query('stateCode') stateCode: string,
  ): object {

    if (!countryCode || !stateCode) {
      throw new NotFoundException('Country code and state code must be provided');
    }

    const cityOfStates = City.getCitiesOfState(countryCode, stateCode);

    if (cityOfStates.length === 0) {
      throw new NotFoundException('No cities found for the provided country and state code');
    }

    return cityOfStates;
  }
}
