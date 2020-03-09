import csv from "csv-parser";
import * as fs from "fs";
import moment from "moment";
import { adultPriceHeader, childPriceHeader } from "./strings";

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
let locale = 'en';
let toursFileName = './input/2020_tours.csv';
let excursionsFileName = './input/2020_calendar.csv'; 

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

    printTableStart();

    excursions.sort((a: Excursion, b: Excursion) => {
      return a.startDate.getTime() - b.startDate.getTime();
    });

    let hasSeenThisMonth = {};
    excursions.forEach((excursion, idx) => {
      const startDateMoment = moment(excursion.startDate);
      const startDateMonthName = startDateMoment.format('MMMM');
      const startDateYear = startDateMoment.year();

      if (!hasSeenThisMonth[startDateMonthName]) {
        printEmptyLine(idx);
        printMonthLine(startDateMonthName, startDateYear);
        hasSeenThisMonth[startDateMonthName] = true;
      } 

      printExcursionLine(excursion)
    });

    printTableEnd();
}

const printTableStart = () => {
  console.log('<table width="95%" align="center">');
};

const printTableEnd = () => {
  console.log('</table>');
};

const printEmptyLine = (index: number) => {
  if (index === 0) {
    return;
  }
  console.log('<tr><td><br /><br /></td><td><br /><br /></td><td><br /><br /></td><td><br /><br /></td></tr>');
};

const printMonthLine = (monthName: string, year: number) => {
  console.log(`<tr>\
		<td><strong><font size="+1" color="#6D2F7A">${monthName.toUpperCase()} ${String(year)}</font></strong></td>\
		<td></td>\
		<td><strong><strong>${adultPriceHeader(locale)}</strong></strong></td>\
		<td><strong>${childPriceHeader(locale)}</strong></td>\
		</tr>`);
};

const printExcursionLine = (excursion: Excursion) => {

  const tour = tours.filter((tour) => tour.tourCode === excursion.tourCode)[0];
  const dates = tripDates(excursion);
  const adultPrice = `$${tour.adultPrice}`;
  const childPrice = tour.childPrice != null ? `$${tour.childPrice}` : '-';

  console.log(`<tr><td>${dates}</td>\
		<td>${tour.tourName}</td>\
		<td align="center">${adultPrice}</td>\
		<td align="center">${childPrice}</td></tr>`);
};

const tripDates = (excursion: Excursion) => {
  const format = 'DD MMMM';
  const singleDay = excursion.endDate === null;

  const startDateStr = moment(excursion.startDate).format(format);
   
  if (singleDay) {
    return startDateStr;
  } else {
    const endDateStr = moment(excursion.endDate).format(format);
    return `${startDateStr} - ${endDateStr}`;
  }
};