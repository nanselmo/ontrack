import TractTierTable from "../data/tract-tier-table"
import createUrl from "shared/util/create-url";
import Geolocation from "shared/types/geolocation";
import * as JSONP from "browser-jsonp";

export const GetTierError = {
  InvalidAddressErr: new Error("Invalid address"),
  NoTierFoundErr: new Error("No CPS tier found for this address"),
  RequestFailedErr: new Error("Request Failed"),
};

export interface GetTierResponse {
  tier: string
  geo: Geolocation
};

export const getTier = (address: string): Promise<GetTierResponse> => {

  return new Promise((resolve, reject) => {
    getTractAndGeo(address).then( ({tract, geo}) => {
      lookupTierFromTract(tract).then( tier => {
        resolve({tier, geo});
      }).catch( err => reject(GetTierError.NoTierFoundErr));
    }).catch( err => {
      if (err === GetTierError.RequestFailedErr){
        reject(GetTierError.RequestFailedErr);
      } else {
        reject(GetTierError.InvalidAddressErr);
      }
    });
  });
};

interface GeocodingAPIParams {
  address: string
  format: "json" | "csv" | "jsonp"
  benchmark: string
  vintage: string
  layers: string
};

interface GeocodingAPIResponse {
  result: {
    addressMatches: GeocodingAddressMatch[]
  }
}

interface GeocodingAddressMatch {
  coordinates: {x: number, y: number}
  geographies:{
    "Census Tracts": [{
      TRACT: string,
      BASENAME: string
    }]
  }
}

const getTractAndGeo = (address: string): Promise<{tract: string, geo: Geolocation}> => {
  const API_BASE_URL = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";
  const apiParams: GeocodingAPIParams = {
    address: address,
    format: "jsonp",
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    layers: "Census Tracts",
  };

  const sendRequest = (baseUrl: string, params: GeocodingAPIParams): Promise<GeocodingAPIResponse> => {
    return new Promise( (resolve, reject) => {
      JSONP({
        url: baseUrl,
        data: params,
        success: (data: GeocodingAPIResponse) => resolve(data),
        error: (err) => {
          reject(GetTierError.RequestFailedErr)
        }
      });
    });
  };

  const extractTract = (response: GeocodingAPIResponse): string => {
    return response.result.addressMatches[0].geographies["Census Tracts"][0].BASENAME;
  };

  const extractGeo = (response: GeocodingAPIResponse): Geolocation => {
    const coords = response.result.addressMatches[0].coordinates;
    return {latitude: coords.y, longitude: coords.x};
  };

  return new Promise( (resolve, reject) => {
    sendRequest(API_BASE_URL, apiParams).then( res => {
      const tract = extractTract(res);
      const geo = extractGeo(res);
      resolve({tract, geo});
    }).catch( e => reject(e));
  });
};

const lookupTierFromTract = (tract: string): Promise<string> => {
  return new Promise( (resolve, reject) => {
      const tier: string = TractTierTable[tract];
      if (tier === undefined) {
        reject(GetTierError.NoTierFoundErr);
      } else {
        resolve(tier);
      }
  });
};

