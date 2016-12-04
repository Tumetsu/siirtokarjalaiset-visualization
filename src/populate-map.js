/**
 * Created by tuomas on 12/3/16.
 */
import flattenDeep from 'lodash/flattenDeep';


export function createPointArraysByYearFromDataset(dataset) {
  let pointArraysByYear = {};

  Object.keys(dataset).map(year => {
    let dataOfYear = dataset[year];
    pointArraysByYear[year] = flattenDeep(dataOfYear.map(locationEntry => {
      painot.push(locationEntry.count);
      return {location: new google.maps.LatLng(locationEntry["lat"], locationEntry["lon"]), weight: locationEntry.count};
    }));
  });

  return pointArraysByYear;
}
