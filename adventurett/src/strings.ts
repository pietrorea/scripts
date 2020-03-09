export const adultPriceHeader = (locale: string) => {
  if (locale === 'en') {
    return 'Price (Adult)';
  } else if (locale === 'es') {
    return 'Precio (Adulto)';
  }
};

export const childPriceHeader = (locale: string) => {
  if (locale === 'en') {
    return 'Price (Child)';
  } else if (locale === 'es') {
    return 'Precio (Ni&ntilde;o)';
  }
};

export const dropdownChoose = (locale: string) => {
  if (locale === 'en') {
    return '--Choose--';
  } else if (locale === 'es') {
    return '--Escoger--';
  }
};

export const dropdownDates = (locale: string) => {
  if (locale === 'en') {
    return 'Dates';
  } else if (locale === 'es') {
    return 'Fechas';
  }
};

