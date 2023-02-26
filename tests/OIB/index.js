function getNewDate(str) {
  if (str.includes(", ")) {
    const arr = str.split(", ");
    const date = arr[0].split(".").reverse().join("-");
    return new Date([date, arr[1]].join("T"));
  } else if (str.includes(" ")) {
    const arr = str.split(" ");
    const date = arr[0].split(".").reverse().join("-");
    return new Date([date, arr[1]].join("T"));
  }
  else {
    return new Date(str.split(".").reverse().join("-"))
  }
}


console.log(getNewDate("31.01.2022, 13:28:01"))
