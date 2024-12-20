
// clone function for deep copy of nested objects; don't use with Date objects
export const clone = (o) => JSON.parse(JSON.stringify(o));

export const capitalize = (str) => {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

// for put postdetails
export const parsedate = (date) => {
    const [month, day, year] = date.split("/").map((part) => parseInt(part, 10));
    // month index based
    return new Date(year, month - 1, day).toISOString(); 
};