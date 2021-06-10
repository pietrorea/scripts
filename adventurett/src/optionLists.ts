import csv from "csv-parser";
import * as fs from "fs";
import moment from "moment";
import { dropdownChoose, dropdownDates } from './strings';

class Tour {
  tourCode: string;
  tourName: string;
  adultPrice: number;
  childPrice?: number;

  constructor(tourCode: string, tourName: string, adultPrice: string, childPrice: string) {
    this.tourCode = tourCode
    this.tourName = tourName
    this.adultPrice = Number(adultPrice)
    this.childPrice = childPrice === '' ? null : Number(childPrice)
  }
}

class Excursion {
  tourCode: string;
  startDate: Date;
  endDate?: Date;

  constructor(tourCode: string, startDate: string, endDate: string) {
    this.tourCode = tourCode
    this.startDate = new Date(startDate)
    this.endDate = endDate === '' ? null : new Date(endDate)
  }
}

const tours: Tour[] = [];
const excursions: Excursion[] = [];

let finishedProcessingToursCSV = false;
let finishedProcessingExcursionsCSV = false;

//change these vars 
let locale = 'es';
let toursFileName = './input/2021/tours.csv';
let excursionsFileName = './input/2021/calendar.csv'; 

moment.locale(locale);

fs.createReadStream(toursFileName)
  .pipe(csv())
  .on('data', (data) => {
    let tourName = (locale === 'es') ? data.TourName_es : data.TourName_en 
    let tour = new Tour(data.TourCode, tourName, data.AdultPrice, data.ChildPrice)
    tours.push(tour);
  })
  .on('end', () => { 
    finishedProcessingToursCSV = true
    processingComplete();
  });

fs.createReadStream(excursionsFileName)
  .pipe(csv())
  .on('data', (data) => {
    let excursion = new Excursion(data.TourCode, data.StartDate, data.EndDate)
    excursions.push(excursion);
  })
  .on('end', () => { 
    finishedProcessingExcursionsCSV = true
    processingComplete();
  });

const processingComplete = () => {
  if (!finishedProcessingExcursionsCSV || !finishedProcessingToursCSV) {
      return;
    }

    let excursionsByTourCode = {};
    excursions.forEach((excursion) => {
      if (!excursionsByTourCode[excursion.tourCode]) {
        excursionsByTourCode[excursion.tourCode] = [excursion];
      } else {
        excursionsByTourCode[excursion.tourCode].push(excursion);
      }
    });

    for (let tourCode in excursionsByTourCode) {
      //Sort excursions by date
      excursionsByTourCode[tourCode].sort((a: Excursion, b: Excursion) => {
        return a.startDate.getTime() - b.startDate.getTime();
      });

      const tour = tours.filter((tour) => tour.tourCode === tourCode)[0];

      console.log("\n");
      console.log(`Name: ${tour.tourName}`)
      console.log(`Adult Price: ${tour.adultPrice}`)
      console.log(`Child Price: ${tour.childPrice}`)
      console.log(`\"${dropdownDates(locale)}\"`);
      console.log(`\"${dropdownChoose(locale)}\"`);
      excursionsByTourCode[tourCode].forEach((ex) => {
        console.log(`\"${tripDates(ex)}\"`);
      });
    }

    excursions.sort((a: Excursion, b: Excursion) => {
      return a.startDate.getTime() - b.startDate.getTime();
    });
}
const tripDates = (excursion: Excursion) => {
  const format = 'MMMM DD, YYYY';
  const singleDay = excursion.endDate === null;

  let startDateStr = moment(excursion.startDate).format(format);
  startDateStr = capitalizeFirstLetter(startDateStr);
   
  if (singleDay) {
    return startDateStr;
  } else {
    let endDateStr = moment(excursion.endDate).format(format);
    endDateStr = capitalizeFirstLetter(endDateStr);
    return `${startDateStr} - ${endDateStr}`;
  }
};

const capitalizeFirstLetter = (word: string) => {
  if (word.length === 0) {
    return '';
  }

  return word.charAt(0).toUpperCase() + word.substring(1);
}