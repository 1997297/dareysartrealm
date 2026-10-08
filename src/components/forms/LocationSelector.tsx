'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, ChevronDown, Check, MapPin, Globe, Building, X } from 'lucide-react';
import { FormField } from './FormField';

interface LocationSelectorProps {
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
  onCountryChange: (country: string, countryCode: string) => void;
  onStateChange: (state: string, stateCode: string) => void;
  onCityChange: (city: string) => void;
  countryError?: string;
  stateError?: string;
  cityError?: string;
}

interface CountryItem {
  name: string;
  isoCode: string;
  flag?: string;
}

interface StateItem {
  name: string;
  isoCode: string;
  countryCode: string;
}

interface CityItem {
  name: string;
}

export function LocationSelector({
  country,
  countryCode,
  state,
  stateCode,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
  countryError,
  stateError,
  cityError,
}: LocationSelectorProps) {
  // Countries data
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  // States data
  const [states, setStates] = useState<StateItem[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [isStateOpen, setIsStateOpen] = useState(false);
  const stateRef = useRef<HTMLDivElement>(null);

  // Cities data
  const [cities, setCities] = useState<CityItem[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  // Load countries once
  useEffect(() => {
    let mounted = true;
    setIsLoadingCountries(true);
    fetch('/api/locations?type=countries')
      .then((res) => res.json())
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setCountries(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load countries:', err);
      })
      .finally(() => {
        if (mounted) setIsLoadingCountries(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Load states when countryCode changes
  useEffect(() => {
    if (!countryCode) {
      setStates([]);
      return;
    }
    let mounted = true;
    setIsLoadingStates(true);
    fetch(`/api/locations?type=states&country=${countryCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setStates(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load states:', err);
      })
      .finally(() => {
        if (mounted) setIsLoadingStates(false);
      });
    return () => {
      mounted = false;
    };
  }, [countryCode]);

  // Load cities when state or country changes
  useEffect(() => {
    if (!countryCode) {
      setCities([]);
      return;
    }
    let mounted = true;
    setIsLoadingCities(true);
    const url = stateCode
      ? `/api/locations?type=cities&country=${countryCode}&state=${stateCode}`
      : `/api/locations?type=cities&country=${countryCode}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setCities(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load cities:', err);
      })
      .finally(() => {
        if (mounted) setIsLoadingCities(false);
      });
    return () => {
      mounted = false;
    };
  }, [countryCode, stateCode]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setIsStateOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine administrative subdivision label based on country
  const stateLabel = useMemo(() => {
    if (!countryCode) return 'State / Province / Region';
    const c = countryCode.toUpperCase();
    if (['US', 'NG', 'IN', 'AU', 'MX', 'BR', 'DE', 'AT', 'FM', 'MM', 'MY', 'SS', 'SD'].includes(c)) {
      return 'State';
    }
    if (['CA', 'CN', 'ZA', 'ID', 'AR', 'NL', 'BE', 'PK', 'PH', 'TH', 'VN', 'CU'].includes(c)) {
      return 'Province';
    }
    if (['GB'].includes(c)) {
      return 'County / Region';
    }
    if (['JP'].includes(c)) {
      return 'Prefecture';
    }
    if (['CH'].includes(c)) {
      return 'Canton';
    }
    if (['FR', 'IT', 'ES', 'CL', 'GH', 'KE', 'TZ', 'NZ', 'PE', 'PT', 'RO', 'DK', 'NO', 'SE', 'FI'].includes(c)) {
      return 'Region';
    }
    return 'State / Province / Region';
  }, [countryCode]);

  // Filtered countries
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    const query = countrySearch.toLowerCase();
    return countries.filter(
      (c) => c.name.toLowerCase().includes(query) || c.isoCode.toLowerCase().includes(query)
    );
  }, [countries, countrySearch]);

  // Filtered states
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return states;
    const query = stateSearch.toLowerCase();
    return states.filter(
      (s) => s.name.toLowerCase().includes(query) || s.isoCode.toLowerCase().includes(query)
    );
  }, [states, stateSearch]);

  // Filtered cities
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities;
    const query = citySearch.toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(query));
  }, [cities, citySearch]);

  const handleSelectCountry = (selected: CountryItem) => {
    onCountryChange(selected.name, selected.isoCode);
    setIsCountryOpen(false);
    setCountrySearch('');
  };

  const handleSelectState = (selected: StateItem) => {
    onStateChange(selected.name, selected.isoCode);
    setIsStateOpen(false);
    setStateSearch('');
  };

  const handleSelectCity = (cityName: string) => {
    onCityChange(cityName);
    setIsCityOpen(false);
    setCitySearch('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* 1. COUNTRY DROPDOWN */}
        <div ref={countryRef} className="relative">
          <FormField
            label="Country"
            required
            error={countryError}
            hint="Worldwide artwork crating & dispatch"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCountryOpen((prev) => !prev)}
                className={`w-full px-4 py-3 bg-canvas border text-left flex items-center justify-between text-sm transition-colors ${
                  countryError
                    ? 'border-rose-400 focus:border-rose-600'
                    : 'border-canvas-border hover:border-charcoal/50 focus:border-charcoal'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <Globe className="w-4 h-4 text-charcoal-muted shrink-0" />
                  {country ? (
                    <span className="text-charcoal font-medium truncate">{country}</span>
                  ) : (
                    <span className="text-charcoal-muted/60">Select country...</span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-charcoal-muted shrink-0 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Country Dropdown Panel */}
              {isCountryOpen && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-canvas border border-charcoal/20 shadow-xl max-h-72 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-2 border-b border-canvas-border bg-canvas-subtle sticky top-0 z-10 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-charcoal-muted shrink-0 ml-1" />
                    <input
                      type="text"
                      autoFocus
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Type country name..."
                      className="w-full bg-transparent text-xs text-charcoal outline-none py-1 placeholder:text-charcoal-muted/60"
                    />
                    {countrySearch && (
                      <button
                        type="button"
                        onClick={() => setCountrySearch('')}
                        className="text-charcoal-muted hover:text-charcoal p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto max-h-60 py-1 divide-y divide-canvas-border/40">
                    {isLoadingCountries ? (
                      <div className="p-4 text-center text-xs text-charcoal-muted">Loading countries...</div>
                    ) : filteredCountries.length === 0 ? (
                      <div className="p-4 text-center text-xs text-charcoal-muted">No countries found</div>
                    ) : (
                      filteredCountries.map((c) => {
                        const isSelected = countryCode === c.isoCode || country === c.name;
                        return (
                          <button
                            key={c.isoCode}
                            type="button"
                            onClick={() => handleSelectCountry(c)}
                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors hover:bg-canvas-subtle ${
                              isSelected ? 'bg-canvas-subtle font-medium text-charcoal' : 'text-charcoal'
                            }`}
                          >
                            <span className="truncate">{c.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-charcoal shrink-0 ml-2" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </FormField>
        </div>

        {/* 2. STATE / PROVINCE / REGION DROPDOWN */}
        <div ref={stateRef} className="relative">
          <FormField
            label={stateLabel}
            required={states.length > 0}
            error={stateError}
            hint={country ? `Subdivisions for ${country}` : 'Select country first'}
          >
            {states.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  disabled={!countryCode}
                  onClick={() => setIsStateOpen((prev) => !prev)}
                  className={`w-full px-4 py-3 bg-canvas border text-left flex items-center justify-between text-sm transition-colors ${
                    !countryCode
                      ? 'opacity-50 cursor-not-allowed border-canvas-border'
                      : stateError
                      ? 'border-rose-400 focus:border-rose-600'
                      : 'border-canvas-border hover:border-charcoal/50 focus:border-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Building className="w-4 h-4 text-charcoal-muted shrink-0" />
                    {state ? (
                      <span className="text-charcoal font-medium truncate">{state}</span>
                    ) : (
                      <span className="text-charcoal-muted/60">Select {stateLabel.toLowerCase()}...</span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-charcoal-muted shrink-0 transition-transform ${isStateOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* State Dropdown Panel */}
                {isStateOpen && countryCode && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-canvas border border-charcoal/20 shadow-xl max-h-72 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-canvas-border bg-canvas-subtle sticky top-0 z-10 flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-charcoal-muted shrink-0 ml-1" />
                      <input
                        type="text"
                        autoFocus
                        value={stateSearch}
                        onChange={(e) => setStateSearch(e.target.value)}
                        placeholder={`Search ${stateLabel.toLowerCase()}...`}
                        className="w-full bg-transparent text-xs text-charcoal outline-none py-1 placeholder:text-charcoal-muted/60"
                      />
                      {stateSearch && (
                        <button
                          type="button"
                          onClick={() => setStateSearch('')}
                          className="text-charcoal-muted hover:text-charcoal p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto max-h-60 py-1 divide-y divide-canvas-border/40">
                      {isLoadingStates ? (
                        <div className="p-4 text-center text-xs text-charcoal-muted">Loading options...</div>
                      ) : filteredStates.length === 0 ? (
                        <div className="p-4 text-center text-xs text-charcoal-muted">No options found</div>
                      ) : (
                        filteredStates.map((s) => {
                          const isSelected = stateCode === s.isoCode || state === s.name;
                          return (
                            <button
                              key={s.isoCode}
                              type="button"
                              onClick={() => handleSelectState(s)}
                              className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors hover:bg-canvas-subtle ${
                                isSelected ? 'bg-canvas-subtle font-medium text-charcoal' : 'text-charcoal'
                              }`}
                            >
                              <span className="truncate">{s.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-charcoal shrink-0 ml-2" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback for countries without subdivisions */
              <input
                type="text"
                disabled={!countryCode}
                value={state}
                onChange={(e) => onStateChange(e.target.value, '')}
                placeholder={countryCode ? `Enter ${stateLabel.toLowerCase()} (optional)` : 'Select country first'}
                className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal disabled:opacity-50"
              />
            )}
          </FormField>
        </div>

        {/* 3. CITY SELECTION */}
        <div ref={cityRef} className="relative">
          <FormField
            label="City"
            required
            error={cityError}
            hint={
              cities.length > 0
                ? 'Select or type your city'
                : countryCode
                ? 'Type your city name'
                : 'Select country and state first'
            }
          >
            {cities.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  disabled={!countryCode}
                  onClick={() => setIsCityOpen((prev) => !prev)}
                  className={`w-full px-4 py-3 bg-canvas border text-left flex items-center justify-between text-sm transition-colors ${
                    !countryCode
                      ? 'opacity-50 cursor-not-allowed border-canvas-border'
                      : cityError
                      ? 'border-rose-400 focus:border-rose-600'
                      : 'border-canvas-border hover:border-charcoal/50 focus:border-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <MapPin className="w-4 h-4 text-charcoal-muted shrink-0" />
                    {city ? (
                      <span className="text-charcoal font-medium truncate">{city}</span>
                    ) : (
                      <span className="text-charcoal-muted/60">Select or enter city...</span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-charcoal-muted shrink-0 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* City Dropdown Panel */}
                {isCityOpen && countryCode && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-canvas border border-charcoal/20 shadow-xl max-h-72 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-canvas-border bg-canvas-subtle sticky top-0 z-10 flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-charcoal-muted shrink-0 ml-1" />
                      <input
                        type="text"
                        autoFocus
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        placeholder="Search or type city..."
                        className="w-full bg-transparent text-xs text-charcoal outline-none py-1 placeholder:text-charcoal-muted/60"
                      />
                      {citySearch && (
                        <button
                          type="button"
                          onClick={() => setCitySearch('')}
                          className="text-charcoal-muted hover:text-charcoal p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto max-h-60 py-1 divide-y divide-canvas-border/40">
                      {citySearch.trim() && !filteredCities.some((c) => c.name.toLowerCase() === citySearch.trim().toLowerCase()) && (
                        <button
                          type="button"
                          onClick={() => handleSelectCity(citySearch.trim())}
                          className="w-full px-3 py-2 text-left text-xs bg-canvas-subtle hover:bg-canvas-subtle/80 text-charcoal flex items-center gap-2 font-medium"
                        >
                          <MapPin className="w-3.5 h-3.5 text-charcoal" />
                          <span>Use &ldquo;{citySearch.trim()}&rdquo;</span>
                        </button>
                      )}
                      {isLoadingCities ? (
                        <div className="p-4 text-center text-xs text-charcoal-muted">Loading cities...</div>
                      ) : filteredCities.length === 0 && !citySearch.trim() ? (
                        <div className="p-4 text-center text-xs text-charcoal-muted">No cities listed. Type to enter manually.</div>
                      ) : (
                        filteredCities.map((c) => {
                          const isSelected = city === c.name;
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => handleSelectCity(c.name)}
                              className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors hover:bg-canvas-subtle ${
                                isSelected ? 'bg-canvas-subtle font-medium text-charcoal' : 'text-charcoal'
                              }`}
                            >
                              <span className="truncate">{c.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-charcoal shrink-0 ml-2" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback for countries/states without city listings in library */
              <input
                type="text"
                disabled={!countryCode}
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                placeholder={countryCode ? 'Enter your city' : 'Select country first'}
                className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal disabled:opacity-50"
              />
            )}
          </FormField>
        </div>
      </div>
    </div>
  );
}

