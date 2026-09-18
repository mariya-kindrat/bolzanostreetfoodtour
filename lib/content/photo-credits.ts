export interface PhotoCredit {
  filename: string;
  commonsTitle: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export const PHOTO_CREDITS: PhotoCredit[] = [
  {
    filename: "hero-dolomites.jpg",
    commonsTitle: "Drei Zinnen Tre Cime di Lavaredo Dolomites.jpg",
    author: "Wolfgang Moroder",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Drei_Zinnen_Tre_Cime_di_Lavaredo_Dolomites.jpg",
  },
  {
    filename: "tile-street-food.jpg",
    commonsTitle: "Speck in Bolzano (Bozen).JPG",
    author: "MOs810",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Speck_in_Bolzano_(Bozen).JPG",
  },
  {
    filename: "tile-cooking-classes.jpg",
    commonsTitle: "Maso Rover - Campi.jpg",
    author: "Syrio",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Maso_Rover_-_Campi.jpg",
  },
  {
    filename: "tile-wine-tours.jpg",
    commonsTitle: "Suedtirol vineyard Kaltern.jpg",
    author: "Verita",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Suedtirol_vineyard_Kaltern.jpg",
  },
  {
    filename: "tile-winter-tours.jpg",
    commonsTitle: "Villaggio natalizio a Mercatini di Bolzano.jpg",
    author: "Losi Rosalio",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Villaggio_natalizio_a_Mercatini_di_Bolzano.jpg",
  },
  {
    filename: "street-food-hero.jpg",
    commonsTitle: "Auf dem Obstmarkt in Bozen, Südtirol.jpg",
    author: "Holger Uwe Schmitt",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Auf_dem_Obstmarkt_in_Bozen,_S%C3%BCdtirol.jpg",
  },
  {
    // Substitution: no suitable "farmhouse cooking" photo turned up after
    // several Commons searches (see task-4 report). This is the Ritten
    // plateau's Earth Pyramids — the actual location of the flagship
    // Farmhouse Private Cooking Class tour — used as the closest available
    // on-theme real photo per the Task 3 substitution policy.
    filename: "cooking-class-hero.jpg",
    commonsTitle: "Earth pyramids.jpg",
    author: "Olga1969",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Earth_pyramids.jpg",
  },
  {
    filename: "wine-tour-hero.jpg",
    commonsTitle: "Vernatsch rebstöcke südtirol 2019-08-30.jpg",
    author: "Z thomas",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vernatsch_rebst%C3%B6cke_s%C3%BCdtirol_2019-08-30.jpg",
  },
  {
    filename: "winter-tour-hero.jpg",
    commonsTitle: "Christkindlmarkt Bozen 01.JPG",
    author: "Skafa~commonswiki",
    license: "CC BY-SA 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Christkindlmarkt_Bozen_01.JPG",
  },
  {
    filename: "default-hero.jpg",
    commonsTitle: "The Dolomites in South Tyrol, Italy.jpg",
    author: "Olga1969",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Dolomites_in_South_Tyrol,_Italy.jpg",
  },
];
