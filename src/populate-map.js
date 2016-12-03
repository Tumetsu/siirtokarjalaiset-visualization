/**
 * Created by tuomas on 12/3/16.
 */
import times from 'lodash/times';
import flattenDeep from 'lodash/flattenDeep';

export function createPointArraysByYearFromDataset(dataset) {
  let pointArraysByYear = {};

  Object.keys(dataset).map(year => {
    let dataOfYear = dataset[year];

    pointArraysByYear[year] = flattenDeep(dataOfYear.map(locationEntry => {
      let points = [];
      // Dataset tells the count of lat&lon points, so add them repeatedly of said count
      // to be visualized.
      times(locationEntry.count, () => {
        points.push(new google.maps.LatLng(locationEntry["lat"], locationEntry["lon"]))
      });
      return points;
    }));
  });

  return pointArraysByYear;
}
