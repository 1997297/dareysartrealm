import { NextRequest, NextResponse } from 'next/server';
import { Country, State, City } from 'country-state-city';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'countries';
  const countryCode = searchParams.get('country') || '';
  const stateCode = searchParams.get('state') || '';

  try {
    if (type === 'countries') {
      const countries = Country.getAllCountries().map((c) => ({
        name: c.name,
        isoCode: c.isoCode,
        flag: c.flag,
      }));
      return NextResponse.json(countries);
    }

    if (type === 'states') {
      if (!countryCode) return NextResponse.json([]);
      const states = State.getStatesOfCountry(countryCode).map((s) => ({
        name: s.name,
        isoCode: s.isoCode,
        countryCode: s.countryCode,
      }));
      return NextResponse.json(states);
    }

    if (type === 'cities') {
      if (!countryCode) return NextResponse.json([]);
      const cities = stateCode
        ? City.getCitiesOfState(countryCode, stateCode)
        : City.getCitiesOfCountry(countryCode) || [];
      const cityList = Array.from(new Set(cities.map((c) => c.name))).map((name) => ({
        name,
      }));
      return NextResponse.json(cityList);
    }

    return NextResponse.json([]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

