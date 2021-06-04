module.exports.get_time = () => {
  const date = new Date();
  const opts = {
    timeZone: 'Africa/Johannesburg',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  return date.toLocaleString('en-ZA', opts);
}

// ------------------------------------------------------------------------------------------------------------------------------

module.exports.date_str = (dateStr, format) => {

  format = format == undefined ? 'en-ZA' : format;


  const date = new Date(dateStr);
  return date.toLocaleString(format, {
    // timeZone: 'Africa/Johannesburg',
    // year: "2-digit",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', '');
}

// ------------------------------------------------------------------------------------------------------------------------------

module.exports.get_date_str = (format) => {

  format = format == undefined ? 'en-ZA' : format;


  const date = new Date();
  return date.toLocaleString(format, {
    timeZone: 'Africa/Johannesburg',
    // year: "2-digit",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', '');
}