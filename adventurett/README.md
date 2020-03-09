
## Description

Every year I help my father set up his list of trips on his business's website, http://www.adventurett.com. The website runs an ancient e-commerce system (Yahoo Small Business). There's a lot of manual work involved so I wrote a couple of tiny scripts to help me do this year after year.

### calendar.ts
Takes in two CSV files and generates raw HTML to populate http://adventurett.com/calendario.html. The first one lists tours and their properties. The second one lists specific excursion dates. See input folder for examples.

### optionLists.ts
Takes in two CSV files and generates a list of RTML options for the "Dates" dropdown in each individual tour page. For an example of the dropdown see http://adventurett.com/atlantic-city.html. 

## Setup
Install `typescript` and `ts-node` globally to run each solution file. 

```
npm i typescript -S
npm i -g ts-node
```

Then, install the script's dependencies:

```
yarn install
```

## Running the scripts

To generate the calendar HTML, go into `calendar.ts` and change the locale (`en` or `es`) as well as the name of the CSV files that hold that year's tours and excursion list.

```
ts-node ./src/calendar.ts > build/2020/es_calendar.html
```

To generate the list of RTML options, go into `optionLists.ts` and change the locale (`en` or `es`) as well as the name of the CSV files that hold that year's tours and excursion list.

```
ts-node ./src/optionLists.ts > build/2020/es_optionLists.txt
```

## Future work

- Pull out duplicated CSV parsing logic into a shared module.
- Supply locale and file names from command line args instead of having to change the script.
- Set up VS Code launch.json to run with configurations instead of the command line.
